import {
    DashboardStats,
    RecordStatus,
    prisma,
    EnhancedDashboardStats,
    ApplicationsByStatus,
    ApplicationsByStage,
    GranteesBySponsorship,
    SchoolsByType,
    binaryToUuid
} from "../utils";

export const getDashboardRepo = async (): Promise<DashboardStats> => {
    try {
        const [sponsorshipCount, schoolCount, studentCount] = await prisma.$transaction([
            prisma.sponsorship.count({
                where: { record_status: RecordStatus.ACTIVE }
            }),
            prisma.school.count({
                where: { record_status: RecordStatus.ACTIVE }
            }),
            prisma.student.count({
                where: { record_status: RecordStatus.ACTIVE }
            })
        ]);

        return {
            numberOfQualifiedStudents: studentCount,
            numberOfFinancialAssistance: sponsorshipCount,
            numberOfSchools: schoolCount,
        };

    } catch (error) {
        console.error('Error getDashboardRepo:', error);
        throw error;
    }
};

export const getEnhancedDashboardRepo = async (): Promise<EnhancedDashboardStats> => {
    try {
        // Calculate date 30 days ago for recent applications
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Basic counts transaction
        const [
            sponsorshipCount,
            schoolCount,
            studentCount,
            publicSchoolCount,
            privateSchoolCount,
            totalApplications,
            recentApplications
        ] = await prisma.$transaction([
            prisma.sponsorship.count({
                where: { record_status: RecordStatus.ACTIVE }
            }),
            prisma.school.count({
                where: { record_status: RecordStatus.ACTIVE }
            }),
            prisma.student.count({
                where: { record_status: RecordStatus.ACTIVE }
            }),
            prisma.school.count({
                where: { record_status: RecordStatus.ACTIVE, school_type: 'Public' }
            }),
            prisma.school.count({
                where: { record_status: RecordStatus.ACTIVE, school_type: 'Private' }
            }),
            prisma.sponsorshipApplication.count({
                where: { record_status: RecordStatus.ACTIVE }
            }),
            prisma.sponsorshipApplication.count({
                where: {
                    record_status: RecordStatus.ACTIVE,
                    created_at: { gte: thirtyDaysAgo }
                }
            })
        ]);

        // GroupBy queries outside transaction (Prisma groupBy has type complexity)
        const applicationsByStatus = await prisma.sponsorshipApplication.groupBy({
            by: ['application_status'],
            where: { record_status: RecordStatus.ACTIVE },
            _count: { application_status: true }
        });

        const applicationsByStage = await prisma.sponsorshipApplication.groupBy({
            by: ['application_stage'],
            where: { record_status: RecordStatus.ACTIVE },
            _count: { application_stage: true }
        });

        const granteesBySponsorshipRaw = await prisma.sponsorshipApplication.groupBy({
            by: ['sponsorship_id'],
            where: {
                record_status: RecordStatus.ACTIVE,
                application_status: 'AWARDED'
            },
            _count: { sponsorship_id: true }
        });

        // Transform applications by status
        const statusCounts: ApplicationsByStatus = {
            pendingPooling: 0,
            followUp: 0,
            complete: 0,
            rejected: 0,
            awarded: 0,
            ranked: 0,
            notQualified: 0
        };

        applicationsByStatus.forEach((item: any) => {
            switch (item.application_status) {
                case 'PENDING_POOLING':
                    statusCounts.pendingPooling = item._count.application_status;
                    break;
                case 'FOLLOW_UP':
                    statusCounts.followUp = item._count.application_status;
                    break;
                case 'COMPLETE':
                    statusCounts.complete = item._count.application_status;
                    break;
                case 'REJECTED':
                    statusCounts.rejected = item._count.application_status;
                    break;
                case 'AWARDED':
                    statusCounts.awarded = item._count.application_status;
                    break;
                case 'RANKED':
                    statusCounts.ranked = item._count.application_status;
                    break;
                case 'NOT_QUALIFIED':
                    statusCounts.notQualified = item._count.application_status;
                    break;
            }
        });

        // Transform applications by stage
        const stageCounts: ApplicationsByStage = {
            pooling: 0,
            applicationList: 0,
            rankingSelection: 0,
            finasProper: 0
        };

        applicationsByStage.forEach((item: any) => {
            switch (item.application_stage) {
                case 'POOLING':
                    stageCounts.pooling = item._count.application_stage;
                    break;
                case 'APPLICATION_LIST':
                    stageCounts.applicationList = item._count.application_stage;
                    break;
                case 'RANKING_SELECTION':
                    stageCounts.rankingSelection = item._count.application_stage;
                    break;
                case 'FINAS_PROPER':
                    stageCounts.finasProper = item._count.application_stage;
                    break;
            }
        });

        // Get sponsorship names for grantees breakdown
        const sponsorshipIds = granteesBySponsorshipRaw.map((item: any) => item.sponsorship_id);
        const sponsorships = await prisma.sponsorship.findMany({
            where: { id: { in: sponsorshipIds } },
            select: { id: true, name: true }
        });

        const sponsorshipNameMap = new Map(
            sponsorships.map(s => [binaryToUuid(s.id), s.name])
        );

        const granteesBySponsorship: GranteesBySponsorship[] = granteesBySponsorshipRaw.map((item: any) => ({
            sponsorshipId: binaryToUuid(item.sponsorship_id),
            sponsorshipName: sponsorshipNameMap.get(binaryToUuid(item.sponsorship_id)) || 'Unknown',
            granteeCount: item._count.sponsorship_id
        }));

        // Schools by type
        const schoolsByType: SchoolsByType = {
            public: publicSchoolCount,
            private: privateSchoolCount
        };

        return {
            numberOfQualifiedStudents: studentCount,
            numberOfFinancialAssistance: sponsorshipCount,
            numberOfSchools: schoolCount,
            applicationsByStatus: statusCounts,
            applicationsByStage: stageCounts,
            granteesBySponsorship,
            schoolsByType,
            recentApplicationsCount: recentApplications,
            totalApplications
        };

    } catch (error) {
        console.error('Error getEnhancedDashboardRepo:', error);
        throw error;
    }
};
