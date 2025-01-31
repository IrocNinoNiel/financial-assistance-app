import { Router } from "express";
import { ResponseHandler } from "../response";
import { StudentRequest } from "../utils";
import { registerStudentService } from "./service";


export default () => {

    const studentAPI = Router();

    studentAPI.post('/', async (req, res) => {

        try {
            const data: StudentRequest = req.body;
            const authHeader = req.headers.authorization;

            const result = await registerStudentService(data, authHeader);
            ResponseHandler.created(req, res, result);
        } catch (err) {
            ResponseHandler.invalidRequest(req, res , err.message);
        }
    });
    return studentAPI;
}


