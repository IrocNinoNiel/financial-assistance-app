import { Router } from "express";
import ResponseHandler from "../response/response";
import { ChangePasswordRequest, LoginRequest, RegisterRequest } from "../utils";
import { changePasswordService, loginService, registerService } from "./service";
import { validateLoginInput, validatePassword, validateRegisterInput, validateStudentRegisterInput, validateUserId } from "../middleware/validation";
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

    authAPI.put('/change-password', authentication, validatePassword, async (req, res) => {

        try {
            const value: ChangePasswordRequest = req.body;
            const authHeader = req.headers.authorization;
            await changePasswordService( value, authHeader );
            ResponseHandler.updated(req, res, "Password Change");
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    authAPI.post('/student/register', validateStudentRegisterInput, async (req, res) => {

        try {
            const value: RegisterRequest = req.body;
            const data = await registerService(value, true);
            ResponseHandler.created(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });


    return authAPI;
}


