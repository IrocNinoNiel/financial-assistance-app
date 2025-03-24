import { Router } from "express";
import { validateApplyScholarship, validateChangeStudentStatus, validateQueryParams, validateSponsorship, validateSponsorshipId, validateStudentId } from "../middleware/validation";
import { ResponseHandler } from "../response";
import { ApplySponsorshipRequest, ApplySponsorshipResponse, ERROR_MESSAGES, getQueryParams, QueryParams, SponsorshipRequest, SponsorshipResponse, SUCCESS_MESSAGES, UpdateStudentStatusRequest, VALIDATION_MESSAGES } from "../utils";
import { adjustStudentEligibilityStatus, applyToSponsorship, createSponsorship, deleteOneSponsorship, getAllAvailableSponsorship, getAllSponsorship, getAllStudentSponsorship, getOneSponsorship, getOneStudentSponsorship, updateSponsorship } from "./service";
import { allowRoles } from "../middleware/authentication";

export default () => {

    // for coordinator

    const sponsorshipAPI = Router();

    sponsorshipAPI.post('/coordinator', allowRoles('system admin', 'financial assistance coordinator' ), validateSponsorship, async (req, res) => {

        try {
            const payload: SponsorshipRequest = req.body;
            const authHeader = req.headers.authorization;
            const data: SponsorshipResponse = await createSponsorship( payload, authHeader );
            ResponseHandler.created(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    }); 

    sponsorshipAPI.put('/coordinator/:sponsorshipId', allowRoles('system admin', 'financial assistance coordinator' ), validateSponsorship, validateSponsorshipId, async (req, res) => {

        try {
            const { sponsorshipId } = req.params;
            const payload: SponsorshipRequest = req.body;
            const authHeader = req.headers.authorization;
            const data: SponsorshipResponse = await updateSponsorship( payload, authHeader, sponsorshipId );
            ResponseHandler.updated(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    }); 

    sponsorshipAPI.get('/coordinator/:sponsorshipId', allowRoles('system admin', 'financial assistance coordinator', ), validateSponsorshipId, async (req, res) => {

        try {
            const { sponsorshipId } = req.params;
            const data: SponsorshipResponse = await getOneSponsorship( sponsorshipId );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    }); 

    sponsorshipAPI.delete('/coordinator/:sponsorshipId', allowRoles('system admin', 'financial assistance coordinator', ), validateSponsorshipId, async (req, res) => {

        try {
            const { sponsorshipId } = req.params;
            await deleteOneSponsorship( sponsorshipId );
            ResponseHandler.deleted(req, res, SUCCESS_MESSAGES.SPONSORSHIP_DELETED);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    }); 

    sponsorshipAPI.get('/coordinator', allowRoles('system admin', 'financial assistance coordinator' ), validateQueryParams , async (req, res) => {

        try {

            const params: QueryParams = getQueryParams(req);
            console.log("parameter", params);
            const authHeader: string = req.headers.authorization;
            const data: SponsorshipResponse[] = await getAllSponsorship( authHeader, params );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    }); 

    sponsorshipAPI.put('/coordinator/students/:studentId/status', allowRoles('system admin', 'financial assistance coordinator' ), validateStudentId, validateChangeStudentStatus, async (req, res)  => {
        try {
            const authHeader: string = req.headers.authorization;
            const { studentId } = req.params;
            const payload: UpdateStudentStatusRequest = req.body;
            
            const response = await adjustStudentEligibilityStatus(studentId, payload, authHeader);
            ResponseHandler.updated(req, res, response);


        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });


    // for students

    sponsorshipAPI.get('/student/available', (req, res) => {
        ResponseHandler.internalServerError( req, res, VALIDATION_MESSAGES.STUDENT_ID_REQUIRED);
    });
    sponsorshipAPI.get('/student/available/:studentId', allowRoles('system admin', 'student' ), validateStudentId, validateQueryParams, async (req, res) => {

        try {
            const { studentId } = req.params;
            const params: QueryParams = getQueryParams(req);
            const data: SponsorshipResponse[] = await getAllAvailableSponsorship( studentId, params );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    }); 

    sponsorshipAPI.get('/student/:sponsorshipId', allowRoles('system admin', 'student' ), validateSponsorshipId, async (req, res) => {

        try {

            const authHeader = req.headers.authorization;
            const { sponsorshipId } = req.params;
            const data: ApplySponsorshipResponse = await getOneStudentSponsorship( sponsorshipId, authHeader );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    }); 

    sponsorshipAPI.post('/student/', allowRoles('system admin', 'student'),  validateApplyScholarship, async (req, res) => {

        try {
            const authHeader = req.headers.authorization;
            const payload: ApplySponsorshipRequest = req.body;
            const data: ApplySponsorshipResponse = await applyToSponsorship( payload, authHeader );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    }); 

    sponsorshipAPI.get('/student/my-sponsorships/:studentId', allowRoles('system admin', 'student'), validateStudentId, async (req, res) => {

        try {

            const authHeader = req.headers.authorization;
            const { studentId } = req.params;
            const data: ApplySponsorshipResponse[] = await getAllStudentSponsorship( studentId, authHeader );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    }); 
    return sponsorshipAPI;
}