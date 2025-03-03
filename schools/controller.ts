import { Router } from "express";
import { ResponseHandler } from "../response";
import { createSchool, getOneSchool, getSchools, updateSchool } from "./service";
import { validateSchool, validateSchoolId } from "../middleware/validation";
import { SchoolPayload } from "../utils";

export default () => {

    const schoolAPI = Router();

    schoolAPI.get('/', async (req, res) => {

        try {
            const data = await getSchools();
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    schoolAPI.get('/:schoolId', validateSchoolId, async (req, res) => {
        try {

            const { schoolId } = req.params;
            const data = await getOneSchool( schoolId );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    })

    schoolAPI.post("/", validateSchool, async ( req, res) => {
        const payload: SchoolPayload = req.body;
        const data = await createSchool( payload );
        ResponseHandler.ok(req, res, data);
    })

    schoolAPI.put("/:schoolId", validateSchoolId, validateSchool, async ( req, res) => {

        const { schoolId } = req.params;
        const payload: SchoolPayload = req.body;
        const data = await updateSchool( payload, schoolId );
        ResponseHandler.ok(req, res, data);
    })

    return schoolAPI;
}