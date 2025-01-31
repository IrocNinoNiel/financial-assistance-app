import { Router } from "express";
import ResponseHandler from "../response/response";
import { registerService } from "./service";
import { RegisterRequest } from "../utils";

export default () => {

    const regAPI = Router();

    regAPI.post('/', async (req, res) => {

        try {
            const value: RegisterRequest = req.body;
            const data = await registerService(value);
            ResponseHandler.created(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });


    return regAPI;
}


