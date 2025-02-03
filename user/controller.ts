import { Router } from "express";
import { ResponseHandler } from "../response";
import { getAllUsers } from "./service";



export default () => {

    const userAPI = Router();

    userAPI.get('/', async (req, res) => {

        try {
            
            const data = await getAllUsers();
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req, res , err.message);
        }
    });

    return userAPI;
}


