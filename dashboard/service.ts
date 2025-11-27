import {
    Prisma,
    PrismaClient,
} from "@prisma/client";
import { DashboardStats } from "../utils";
import { getDashboardRepo } from "./respository";

const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
});

export const getDashboardInformation = async (): Promise<DashboardStats> => {

    const data: DashboardStats = await getDashboardRepo();
    return data;
}