import { Router } from "express";
import { ResponseHandler } from "../response";
import { StudentRequest, VALIDATION_MESSAGES } from "../utils";
import { getAllStudent, getOneStudent, registerStudentService, updateStudentService } from "./service";
import { validateGetOneStudent, validateStudentRegistration, validateUpdateStudent } from "../middleware/validation";
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

    studentAPI.get('/:userId', validateGetOneStudent, async (req, res) => { 
        try {

            const { userId } = req.params;
            const result = await getOneStudent( userId );
            ResponseHandler.ok(req, res, result);

        } catch (err) {
            ResponseHandler.internalServerError(req, res , err.message);
        }
    })

    return studentAPI;
}


