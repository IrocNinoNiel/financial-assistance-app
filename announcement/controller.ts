import { Router } from "express";
import { ResponseHandler } from "../response";
import { AnnouncementDataMinimal, AnnouncementPayloadString, FlattenedAnnouncementData, FlattenedAnnouncementDataMinimal, getQueryParams, QueryParams, SUCCESS_MESSAGES } from "../utils";
import { createAnnouncement, deleteAnnouncement, getAllAnnouncement, getOneAnnouncement, updateAnnouncement } from "./service";
import { upload } from "../middleware/uploads";
import { checkIfAnnIdExist, checkIfAnnIdExistForGet, createAnnouncementValidation } from "../middleware/validation";
import { allowRoles } from "../middleware/authentication";

export default () => {

    const announcementAPI = Router();

    announcementAPI.post('/', allowRoles('system admin', 'financial assistance coordinator' ), upload.array("files", 5), createAnnouncementValidation, async (req, res) => {

        try {

            const authHeader: string = req.headers.authorization;
            const files = req.files as Express.Multer.File[];
            const payload: AnnouncementPayloadString = req.body;
            const response: FlattenedAnnouncementData = await createAnnouncement( payload, files, authHeader );
            ResponseHandler.created(req, res, response);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    announcementAPI.put('/:annId'
        , allowRoles('system admin', 'financial assistance coordinator' )
        , checkIfAnnIdExist
        , upload.array("files", 5)
        , createAnnouncementValidation
        , async(req, res) => {
        try {
            const authHeader: string = req.headers.authorization;
            const files = req.files as Express.Multer.File[];
            const payload: AnnouncementPayloadString = req.body;
            const { annId } = req.params;
            const response: FlattenedAnnouncementData = await updateAnnouncement( payload, files, annId, authHeader );
            ResponseHandler.updated(req, res, response);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    announcementAPI.delete('/:annId', allowRoles('system admin', 'financial assistance coordinator' ), checkIfAnnIdExist, async(req, res) => {
        try {
            const { annId } = req.params;
            await deleteAnnouncement( annId );
            ResponseHandler.updated(req, res, SUCCESS_MESSAGES.ANNOUNCEMENT_DELETED);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    announcementAPI.get('/:annId', checkIfAnnIdExistForGet, async(req, res) => {
        try {
            const { annId } = req.params;
            const response: FlattenedAnnouncementData = await getOneAnnouncement( annId );
            ResponseHandler.ok(req, res, response);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    announcementAPI.get('/', async(req, res) => {
        try {
            const authHeader: string = req.headers.authorization;
            const params: QueryParams = getQueryParams(req);
            const response: FlattenedAnnouncementDataMinimal[] = await getAllAnnouncement( params, authHeader );
            ResponseHandler.ok(req, res, response);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    return announcementAPI;
}