import { Router } from "express";
import { ResponseHandler } from "../response";
import { StudentRequest } from "../utils";
import { getAllStudent, getOneStudent, updateStudentService } from "./service";
import { validateStudentRegistration, validateUpdateStudent, validateGetOneStudent, validateStudentId } from "../middleware/validation";


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

    studentAPI.get('/:studentId', validateStudentId, async (req, res) => { 
        try {

            const { studentId } = req.params;
            const result = await getOneStudent( studentId );
            ResponseHandler.ok(req, res, result);

        } catch (err) {
            ResponseHandler.internalServerError(req, res , err.message);
        }
    })

    studentAPI.get('/', async (req, res) => { 
        try {

            const result = await getAllStudent();
            ResponseHandler.ok(req, res, result);

        } catch (err) {
            ResponseHandler.internalServerError(req, res , err.message);
        }
    })


    return studentAPI;
}


