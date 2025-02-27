import { Prisma } from "@prisma/client";
import { fileUploadRepo, findFileTypeIdRepo, imageUploadRepo } from "./repository"
import { binaryToUuid, uuidToBinary } from "../utils";

export const fileUpload= async ( userId: string, uploadedFileName: string, mimetype: string,fileTypeId: string, path: string, userUUID: string ) => { 
    const data: Prisma.fileUncheckedCreateInput = {
        file_name: uploadedFileName,
        path,
        mime_type: mimetype,
        file_type_id: uuidToBinary(fileTypeId),
        user_id: uuidToBinary(userId),
        created_by: uuidToBinary(userUUID),
        updated_by: uuidToBinary(userUUID),
        updated_at: new Date()
    }
    return await fileUploadRepo( data);
}

export const imageUpload= async ( userId: string, uploadedImageName: string) => { 
    return await imageUploadRepo( uploadedImageName, userId);
}

export const findFileTypeId = async (fileTypeId: string): Promise<boolean>  => {
    return await findFileTypeIdRepo(fileTypeId)
}