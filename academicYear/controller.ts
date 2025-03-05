import { Router } from "express";
import { ResponseHandler } from "../response";
import { createAcadYear, deleteOneAcadYear, getAllAcadYear, getOneAcadYear, updateAcadYear } from './service';
import { AcademicYearRequest, AcademicYearResponse, SUCCESS_MESSAGES } from "../utils";
import { validateAcademicYear, validateAcademicYearId } from "../middleware/validation";

export default () => {

    const academicYearApi = Router();

    academicYearApi.post('/', validateAcademicYear, async (req, res) => {

        try {
            const payload: AcademicYearRequest = req.body;
            const authHeader = req.headers.authorization;
            const data: AcademicYearResponse = await createAcadYear( payload, authHeader );
            ResponseHandler.created(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    academicYearApi.put('/:academicYearId', validateAcademicYear, validateAcademicYearId, async (req, res) => {

        try {
            const payload: AcademicYearRequest = req.body;
            const authHeader = req.headers.authorization;
            const { academicYearId } = req.params;

            const data: AcademicYearResponse = await updateAcadYear( payload, authHeader, academicYearId );
            ResponseHandler.updated(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    academicYearApi.get('/', async (req, res) => {

        try {
            const data: AcademicYearResponse[] = await getAllAcadYear( );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    academicYearApi.get('/:academicYearId', validateAcademicYearId, async (req, res) => {

        try {
            const { academicYearId } = req.params;

            const data: AcademicYearResponse = await getOneAcadYear( academicYearId );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    academicYearApi.delete('/:academicYearId', validateAcademicYearId, async (req, res) => {

        try {
            const { academicYearId } = req.params;
            await deleteOneAcadYear( academicYearId );
            ResponseHandler.deleted(req, res, SUCCESS_MESSAGES.ACADEMIC_YEAR_DELETED);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });
    return academicYearApi;
}