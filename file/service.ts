import { fileUploadRepo } from "./repository"

export const fileUpload= async ( studentId: number, uploadedFileName: string ) => { 
    return await fileUploadRepo( studentId, uploadedFileName);
}