import { Router } from "express";
import { ResponseHandler } from "../response";
import { allowRoles } from "../middleware/authentication";
import { getDashboardInformation } from "./service";

export default () => {

    // for coordinator

    const sponsorshipAPI = Router();

    sponsorshipAPI.get('/dashboard', allowRoles('system admin', 'financial assistance coordinator', 'student', 'sponsor' ), async (req, res) => {

        try {

            const authHeader: string = req.headers.authorization;
            const data: any[] = await getDashboardInformation();
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    }); 

    return sponsorshipAPI;
}