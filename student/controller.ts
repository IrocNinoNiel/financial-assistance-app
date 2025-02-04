import { Router } from "express";
import { ResponseHandler } from "../response";
import { StudentRequest, VALIDATION_MESSAGES } from "../utils";
import { getAllStudent, registerStudentService } from "./service";
import { validateStudentRegistration } from "../middleware/validation";
import { permission } from "../middleware/authentication";
import { toStudentResponse } from "../utils/converter";

export default () => {

    const studentAPI = Router();

    studentAPI.post('/', validateStudentRegistration, async (req, res) => {

        try {
            const data: StudentRequest = req.body;
            const authHeader = req.headers.authorization;

            const result = await registerStudentService(data, authHeader);
            ResponseHandler.created(req, res, result);
        } catch (err) {
            ResponseHandler.invalidRequest(req, res , err.message);
        }
    });

    studentAPI.get('/', permission, async (req, res) => { 
        try {

            const result = await getAllStudent();
            const converted = toStudentResponse( result );
            ResponseHandler.ok(req, res, { count: converted.length, students: converted });
        } catch (err) {
            ResponseHandler.internalServerError(req, res , err.message);
        }
    })

    return studentAPI;
}


