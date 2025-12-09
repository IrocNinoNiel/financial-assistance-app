import { Router } from "express";
import { ResponseHandler } from "../response";
import { allowRoles } from "../middleware/authentication";
import { getDashboardInformation } from "./service";
import { DashboardStats } from "../utils";

export default () => {

    const dashboardAPI = Router();

    dashboardAPI.get('/dashboard', allowRoles('system admin', 'financial assistance coordinator', 'student', 'sponsor'), async (req, res) => {

        try {

            const data: DashboardStats = await getDashboardInformation();
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve dashboard information';
            ResponseHandler.invalidRequest(req, res, errorMessage);
        }
    });

    return dashboardAPI;
}