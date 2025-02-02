import { Router } from "express";
import multer from "multer";
import { ResponseHandler } from "../response";
import { SUCCESS_MESSAGES, VALIDATION_MESSAGES } from "../utils";
import path from "path";
import { fileUploadService } from "./service";


export default () => {

    const fileAPI = Router();

    fileAPI.post('/',  async (req, res) => {
        await fileUploadService( req, res);
        ResponseHandler.created(req, res, SUCCESS_MESSAGES.FILE_SAVED);
    });

    return fileAPI;
}


