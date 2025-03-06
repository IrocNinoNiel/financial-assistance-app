import { Router } from "express";
import { validateSponsorship, validateSponsorshipId } from "../middleware/validation";
import { ResponseHandler } from "../response";
import { SponsorshipRequest, SponsorshipResponse, SUCCESS_MESSAGES } from "../utils";
import { createSponsorship, deleteOneSponsorship, getAllSponsorship, getOneSponsorship, updateSponsorship } from "./service";

export default () => {

    const sponsorshipAPI = Router();

    sponsorshipAPI.post('/', validateSponsorship, async (req, res) => {

        try {
            const payload: SponsorshipRequest = req.body;
            const authHeader = req.headers.authorization;
            const data: SponsorshipResponse = await createSponsorship( payload, authHeader );
            ResponseHandler.created(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    }); 

    sponsorshipAPI.put('/:sponsorshipId', validateSponsorship, validateSponsorshipId, async (req, res) => {

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

    sponsorshipAPI.get('/', async (req, res) => {

        try {
            const data: SponsorshipResponse[] = await getAllSponsorship( );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    }); 

    sponsorshipAPI.get('/:sponsorshipId', validateSponsorshipId, async (req, res) => {

        try {
            const { sponsorshipId } = req.params;
            const data: SponsorshipResponse = await getOneSponsorship( sponsorshipId );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    }); 

    sponsorshipAPI.delete('/:sponsorshipId', validateSponsorshipId, async (req, res) => {

        try {
            const { sponsorshipId } = req.params;
            await deleteOneSponsorship( sponsorshipId );
            ResponseHandler.deleted(req, res, SUCCESS_MESSAGES.SPONSORSHIP_DELETED);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    }); 


    return sponsorshipAPI;
}