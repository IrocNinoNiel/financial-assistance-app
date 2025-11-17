import { Prisma, PrismaClient } from "@prisma/client";
import { RecordStatus, uuidToBinary } from "../utils";

const prisma = new PrismaClient({
    log: ["query"],
});

export const getDashboardRepo = async (): Promise<any> => {
    try {
        return await prisma.school.findMany({});
    } catch (error) {
        console.error('Error getDashboardRepo:', error);
        throw new Error('Database error');
    }
};
