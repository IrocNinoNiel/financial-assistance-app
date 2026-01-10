import { Router } from "express";
import { ResponseHandler } from "../response";
import { allowRoles } from "../middleware/authentication";
import { getDashboardInformation, getEnhancedDashboardInformation } from "./service";
import { DashboardStats, EnhancedDashboardStats } from "../utils";

export default () => {

    const dashboardAPI = Router();

    // Basic dashboard stats (original endpoint)
    dashboardAPI.get('/', allowRoles('system admin', 'financial assistance coordinator', 'student', 'sponsor'), async (req, res) => {
        try {
            const data: DashboardStats = await getDashboardInformation();
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve dashboard information';
            ResponseHandler.invalidRequest(req, res, errorMessage);
        }
    });

    // Enhanced dashboard stats with detailed breakdowns
    dashboardAPI.get('/enhanced', allowRoles('system admin', 'financial assistance coordinator', 'sponsor'), async (req, res) => {
        try {
            const data: EnhancedDashboardStats = await getEnhancedDashboardInformation();
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve enhanced dashboard information';
            ResponseHandler.invalidRequest(req, res, errorMessage);
        }
    });

    return dashboardAPI;
}