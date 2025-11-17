import {
    Prisma,
    PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
});

export const getDashboardInformation = async (): Promise<any[]> => {

    const data: any[] = [];
    const converted: any[] = data.map(item => []);
    
    return converted;
}