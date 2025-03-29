import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure 'uploads' directory exists
const uploadDir = "uploads/announcement";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Allowed file extensions
const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".pdf",
    ".doc",
    ".docx",
];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File filter function
const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only images and documents are allowed."));
    }
};

// Multer upload configuration
export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
