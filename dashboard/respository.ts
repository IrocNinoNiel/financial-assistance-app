import { Prisma, PrismaClient } from "@prisma/client";
import { DashboardStats, RecordStatus, uuidToBinary } from "../utils";

const prisma = new PrismaClient({
    log: ["query"],
});

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
            numberOfQualifiedStudents: sponsorshipCount,
            numberOfFinancialAssistance: schoolCount,
            numberOfSchools: studentCount,
        };

    } catch (error) {
        console.error('Error getDashboardRepo:', error);
        throw new Error('Database error');
    }
};

