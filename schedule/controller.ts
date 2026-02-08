import { Router } from "express";
import { ResponseHandler } from "../response";
import { edit, fetch, list, remove, store, generateSchedulePDFForStudent, notifyAllStudentsWithPDF, getScheduleWithStudents } from "./service";
import { getQueryParams, QueryParams, ScheduleRequest, VALIDATION_MESSAGES } from "../utils";
import { validateScheduleId, validateSchedulePayload, validateStudentId } from "../middleware/validation";
import { allowRoles } from "../middleware/authentication";



export default () => {

    const scheduleAPI = Router();

    scheduleAPI.post('/', allowRoles('system admin', 'financial assistance coordinator' ), validateSchedulePayload,  async (req, res) => {
        try {
            const authHeader: string = req.headers.authorization;
            const payload: ScheduleRequest = req.body;
            const data = await store( payload, authHeader );
            ResponseHandler.created(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    scheduleAPI.put('/:scheduleId', allowRoles('system admin', 'financial assistance coordinator' ), validateScheduleId , validateSchedulePayload,  async (req, res) => {
        try {
            const { scheduleId } = req.params.scheduleId;
            const authHeader: string = req.headers.authorization;
            const payload: ScheduleRequest = req.body;
            const data = await edit( payload, scheduleId, authHeader );
            ResponseHandler.updated(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    scheduleAPI.get('/', async (req, res) => {
        try {
            const authHeader: string = req.headers.authorization;
            const params: QueryParams = getQueryParams(req);
            const data = await list( authHeader, params );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    scheduleAPI.get('/:scheduleId', validateScheduleId , async (req, res) => {
        try {
            const { scheduleId } = req.params.scheduleId;
            const data = await fetch( scheduleId );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    scheduleAPI.delete('/:scheduleId', allowRoles('system admin', 'financial assistance coordinator' ), validateScheduleId , async (req, res) => {
        try {
            const { scheduleId } = req.params.scheduleId;
            await remove( scheduleId );
            ResponseHandler.deleted(req, res, VALIDATION_MESSAGES.SCHEDULE_DELETED);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    // Generate and download PDF for a specific student's schedule
    scheduleAPI.get('/:scheduleId/pdf/:studentId', validateScheduleId, async (req, res) => {
        try {
            const { scheduleId, studentId } = req.params;
            const pdfData = await generateSchedulePDFForStudent(scheduleId, studentId);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${pdfData.fileName}"`);
            res.send(pdfData.buffer);
        } catch (err) {
            ResponseHandler.invalidRequest(req, res, err.message);
        }
    });

    // Notify all students in a schedule with PDF attachment
    scheduleAPI.post('/:scheduleId/notify-all', allowRoles('system admin', 'financial assistance coordinator'), validateScheduleId, async (req, res) => {
        try {
            const { scheduleId } = req.params;
            const authHeader: string = req.headers.authorization;
            const result = await notifyAllStudentsWithPDF(scheduleId, authHeader);
            ResponseHandler.ok(req, res, result);
        } catch (err) {
            ResponseHandler.invalidRequest(req, res, err.message);
        }
    });

    // Get schedule with associated students
    scheduleAPI.get('/:scheduleId/students', validateScheduleId, async (req, res) => {
        try {
            const { scheduleId } = req.params;
            const data = await getScheduleWithStudents(scheduleId);
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req, res, err.message);
        }
    });

    return scheduleAPI;
}