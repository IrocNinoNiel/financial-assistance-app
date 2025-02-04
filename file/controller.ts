import { Router } from "express";
import multer from "multer";
import { ResponseHandler } from "../response";
import { extractUserFromToken, SUCCESS_MESSAGES, VALIDATION_MESSAGES } from "../utils";
import path from "path";
import { fileUpload } from "./service";
import { findStudent } from "./repository";


export default () => {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/");
          },
          filename: (req, file, cb) => {
            const date = new Date();
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            cb(null, `${formattedDate}-${file.originalname}`);
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

    fileAPI.post('/',  async (req, res) => {
        upload(req, res, async (err: any) => {
            if (err) {
              console.error("File upload error:", err);
              ResponseHandler.invalidRequest(req, res, { message: err.message });
              
            } else if (!req.file) {
              ResponseHandler.invalidRequest(req, res, { message: "No file uploaded" });
            } else {
        
        
                const authHeader = req.headers.authorization;
                const userDetails = extractUserFromToken(authHeader);
                const studentId = await findStudent(userDetails.userId);

                const date = new Date();
                const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                const uploadedFileName = `${formattedDate}-${req.file.originalname}`;
        
                await fileUpload( studentId, uploadedFileName ); 
                ResponseHandler.created(req, res, SUCCESS_MESSAGES.FILE_SAVED);
            }
        });
    });

    return fileAPI;
}


