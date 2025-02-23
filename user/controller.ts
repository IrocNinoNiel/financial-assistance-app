import { Router } from "express";
import { ResponseHandler } from "../response";
import { getAllUsers, getOneUser } from "./service";
import { validateUserId } from "../middleware/validation";



export default () => {

    const userAPI = Router();

    userAPI.get('/', async (req, res) => {

        try {
            
            const data = await getAllUsers();
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req, res , err.message);
        }
    });

    userAPI.get('/:userId', validateUserId, async (req, res) => {

        try {
            
            const { userId } = req.params;
            const data = await getOneUser( userId );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req, res , err.message);
        }
    });


    return userAPI;
}


