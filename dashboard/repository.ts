import { DashboardStats, RecordStatus, prisma } from "../utils";

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

