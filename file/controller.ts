import { Router } from "express";
import multer from "multer";
import { ResponseHandler } from "../response";
import { extractUserFromToken, SUCCESS_MESSAGES, VALIDATION_MESSAGES } from "../utils";
import path from "path";
import { fileUpload, findFileTypeId } from "./service";



export default () => {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/");
          },
          filename: (req, file, cb) => {
            const epochMilliseconds = Date.now();
            cb(null, `${epochMilliseconds}-${file.originalname}`);
        }
    });
    
    const fileFilter = (req: any, file: any, cb: any) => {
      const allowedTypes = /pdf|docx?/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
    
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        return cb(new Error(VALIDATION_MESSAGES.INVALID_FILE_TYPE), false);
      }
    };
    
    const upload = multer({
        storage,
        fileFilter,
        limits: { fileSize: 10 * 1024 * 1024 },
    }).single("applicationForm");

    const fileAPI = Router();

    fileAPI.post('/', async (req, res) => {
      upload(req, res, async (err: any) => {
        if (err) {
          console.error("File upload error:", err);
          ResponseHandler.invalidRequest(req, res, { message: err.message });
          
        } else if (!req.file) {
          ResponseHandler.invalidRequest(req, res, { message: "No file uploaded" });
        } else {
          
          const authHeader = req.headers.authorization;
          const userDetails = extractUserFromToken(authHeader);
          const { fileTypeId } = req.body;

          if(!fileTypeId) {
            ResponseHandler.invalidRequest(req, res, {"errors": [ {"type": "field", "value": fileTypeId, "msg": VALIDATION_MESSAGES.MISSING_FILE_TYPE_ID, "path": "fileTypeId", "location": "body"}]})
          }

          const exists = await findFileTypeId(fileTypeId);
          if (!exists) {
            ResponseHandler.invalidRequest(req, res, {"errors": [ {"type": "field", "value": fileTypeId, "msg": VALIDATION_MESSAGES.INVALID_FILE_TYPE_ID, "path": "fileTypeId", "location": "body"}]})
          }
        
          await fileUpload(userDetails.userId, req.file.filename, req.file.mimetype, fileTypeId,  req.file.path, userDetails.userId);
          ResponseHandler.created(req, res, SUCCESS_MESSAGES.FILE_SAVED);
        }
      });
    });

    return fileAPI;
}


