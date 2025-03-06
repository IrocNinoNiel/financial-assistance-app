import { Prisma } from "@prisma/client";
import { checkIfInvalidFileTypeIdRepo, fileUploadRepo, findFileTypeIdRepo, getAllFileTypeRepo, imageUploadRepo } from "./repository"
import { binaryToUuid, uuidToBinary } from "../utils";
import { FileTypeResponse } from '../utils/types';
import { toFileTypeResponse } from "../utils/converter";

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

export const checkIfInvalidFileTypeId = async ( fileTypeIds: string[]): Promise<boolean> => {
    const convertedId: Buffer[] = fileTypeIds.map( item => uuidToBinary(item));
    return await checkIfInvalidFileTypeIdRepo( convertedId );
}

export const getAllFileType = async ():Promise<any> => {
    const data = await getAllFileTypeRepo();
    const converted =  data.map( item => toFileTypeResponse(item))
    return { count: converted.length, fileTypes: converted }
}