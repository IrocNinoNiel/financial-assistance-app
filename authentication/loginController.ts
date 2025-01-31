import { Router } from "express";
import ResponseHandler from "../response/response";
import { LoginRequest } from "../utils";
import { loginService } from "./service";

export default () => {

    const loginAPI = Router();

    loginAPI.post('/', async (req, res) => {

        try {
            const value: LoginRequest = req.body;
            const data = await loginService(value);
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });


    return loginAPI;
}


