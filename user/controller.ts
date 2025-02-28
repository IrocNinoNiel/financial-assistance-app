import { Router } from "express";
import { ResponseHandler } from "../response";
import { deleteUserService, getAllUsers, getOneUser, updateUserService } from "./service";
import { validateUpdateUserInput, validateUserId } from "../middleware/validation";
import { RegisterRequest, UpdateUserRequest } from "../utils";



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

    userAPI.put('/:userId', validateUpdateUserInput, async (req, res) => {

        try {
            const value: UpdateUserRequest = req.body;
            const { userId } = req.params;
            const data = await updateUserService( value, userId );
            ResponseHandler.updated(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req, res , err.message);
        }
    });

    userAPI.delete('/:userId', validateUserId, async (req, res) => {

        try {
            const { userId } = req.params;
            await deleteUserService( userId );
            ResponseHandler.deleted(req, res, "User Successfully deleted");
        } catch (err) {
            ResponseHandler.invalidRequest(req, res , err.message);
        }
    });

    return userAPI;
}


