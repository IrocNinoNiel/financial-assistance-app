import { Router } from "express";
import { ResponseHandler } from "../response";
import { getSchools } from "./service";

export default () => {

    const schoolAPI = Router();

    schoolAPI.get('/', async (req, res) => {

        try {
            const data = await getSchools();
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    return schoolAPI;
}