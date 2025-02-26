import { Router } from "express";
import ResponseHandler from "../response/response";
import { LoginRequest, RegisterRequest } from "../utils";
import { loginService, registerService } from "./service";
import { validateLoginInput, validateRegisterInput } from "../middleware/validation";
import { authentication } from "../middleware/authentication";

export default () => {

    const authAPI = Router();

    authAPI.post('/login', validateLoginInput, async (req, res) => {

        try {
            const value: LoginRequest = req.body;
            const data = await loginService(value);
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    authAPI.post('/register', authentication, validateRegisterInput, async (req, res) => {

        try {
            const value: RegisterRequest = req.body;
            const data = await registerService(value);
            ResponseHandler.created(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    authAPI.post('/student/register', validateRegisterInput, async (req, res) => {

        try {
            const value: RegisterRequest = req.body;
            // const data = await registerService(value);
            ResponseHandler.created(req, res, "data");
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });


    return authAPI;
}


