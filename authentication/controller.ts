import { Router } from "express";
import ResponseHandler from "../response/response";
import { ChangePasswordRequest, LoginRequest, RegisterRequest } from "../utils";
import { changePasswordService, getAuthDetails, loginService, registerService, forgotPasswordService, resetPasswordService, validateResetToken } from "./service";
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

    authAPI.get('/me' ,authentication, async( req, res ) => {
        try {
            const authHeader = req.headers.authorization;
            const data = await getAuthDetails( authHeader );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    })

    // Password Reset Routes
    authAPI.post('/forgot-password', async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                ResponseHandler.invalidRequest(req, res, 'Email is required');
                return;
            }
            const data = await forgotPasswordService(email);
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req, res, err.message);
        }
    });

    authAPI.post('/reset-password', async (req, res) => {
        try {
            const { token, password } = req.body;
            if (!token || !password) {
                ResponseHandler.invalidRequest(req, res, 'Token and password are required');
                return;
            }
            if (password.length < 6) {
                ResponseHandler.invalidRequest(req, res, 'Password must be at least 6 characters');
                return;
            }
            const data = await resetPasswordService(token, password);
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req, res, err.message);
        }
    });

    authAPI.get('/validate-reset-token/:token', async (req, res) => {
        try {
            const { token } = req.params;
            const data = await validateResetToken(token);
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req, res, err.message);
        }
    });

    return authAPI;
}


