import { DashboardStats } from "../utils";
import { getDashboardRepo } from "./repository";

export const getDashboardInformation = async (): Promise<DashboardStats> => {

    const data: DashboardStats = await getDashboardRepo();
    return data;
}