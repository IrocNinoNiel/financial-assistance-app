import { Prisma } from "@prisma/client";
import { fileUploadRepo, findFileTypeIdRepo } from "./repository"
import { uuidToBinary } from "../utils";

export const fileUpload= async ( userId: number, uploadedFileName: string, mimetype: string,fileTypeId: number, path: string, userUUID: string ) => { 
    const data: Prisma.fileUncheckedCreateInput = {
        file_name: uploadedFileName,
        path,
        mime_type: mimetype,
        file_type_id: fileTypeId,
        user_id: userId,
        created_by: uuidToBinary(userUUID),
        updated_by: uuidToBinary(userUUID),
        updated_at: new Date()
    }
    return await fileUploadRepo( data);
}

export const findFileTypeId = async (fileTypeId: number): Promise<boolean>  => {
    return await findFileTypeIdRepo(fileTypeId)
}