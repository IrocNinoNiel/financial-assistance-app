import { Router } from "express";
import { ResponseHandler } from "../response";
import { getRoles } from "./service";

export default () => {

    const roleAPI = Router();

    roleAPI.get('/', async (req, res) => {

        try {
            const data = await getRoles();
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    return roleAPI;
}