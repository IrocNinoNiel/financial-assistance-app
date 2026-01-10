import { DashboardStats, EnhancedDashboardStats } from "../utils";
import { getDashboardRepo, getEnhancedDashboardRepo } from "./repository";

export const getDashboardInformation = async (): Promise<DashboardStats> => {
    const data: DashboardStats = await getDashboardRepo();
    return data;
};

export const getEnhancedDashboardInformation = async (): Promise<EnhancedDashboardStats> => {
    const data: EnhancedDashboardStats = await getEnhancedDashboardRepo();
    return data;
};