import { Router } from "express";
import { ResponseHandler } from "../response";
import { StudentRequest, VALIDATION_MESSAGES } from "../utils";
import { getAllStudent, registerStudentService, updateStudentService } from "./service";
import { validateStudentRegistration, validateUpdateStudent } from "../middleware/validation";
import { permission } from "../middleware/authentication";
import { toStudentResponse } from "../utils/converter";

export default () => {

    const studentAPI = Router();

    studentAPI.post('/', validateStudentRegistration, async (req, res) => {

        try {
            const data: StudentRequest = req.body;
            const authHeader = req.headers.authorization;

            // const result = await registerStudentService(data, authHeader);
            ResponseHandler.created(req, res, "API has been disable for now");
        } catch (err) {
            ResponseHandler.invalidRequest(req, res , err.message);
        }
    });

    studentAPI.put('/:studentId', validateUpdateStudent, async (req, res) => {

        try {
            const data: StudentRequest = req.body;
            const authHeader = req.headers.authorization;
            const { studentId } = req.params;

            const result = await updateStudentService(data, authHeader, studentId);
            ResponseHandler.updated(req, res, result);
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


