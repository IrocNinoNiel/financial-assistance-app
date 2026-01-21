import { Prisma } from "@prisma/client";
import { binaryToUuid, SchoolPayload, SchoolResponse, uuidToBinary } from "../utils";
import { toSchoolModel, toSchoolResponse } from "../utils/converter";
import { checkIfInvalidSchoolIdRepo, checkSchoolExistRepo, checkSchoolNameExistRepo, createSchoolRepo, deleteSchoolRepo, getOneSchoolRepo, getSchoolsRepo, updateSchoolRepo } from "./repository";

export const getSchools = async (): Promise<SchoolResponse[]> => {

    const data: any[] = await getSchoolsRepo();
    const converted: SchoolResponse[] = data.map(item => toSchoolResponse(item));
   
    return converted;
}

export const checkSchoolExist = async ( id: string): Promise<Boolean> => {
    return checkSchoolExistRepo( id );
}

export const getOneSchool = async ( id: string): Promise<any> => {
    const data: any =  await getOneSchoolRepo( id );
    return toSchoolResponse(data);
}

export const createSchool = async ( payload: SchoolPayload ): Promise<SchoolResponse> => {
    const convertedData: Prisma.schoolUncheckedCreateInput = toSchoolModel(payload);
    const school = await createSchoolRepo( convertedData );
    const data: any =  await getOneSchoolRepo( binaryToUuid(school.id) );
    return toSchoolResponse(data);   
}

export const updateSchool = async ( payload: SchoolPayload, schoolId: string ): Promise<SchoolResponse> => {
    const convertedData: Prisma.schoolUncheckedCreateInput = toSchoolModel(payload);
    const school = await updateSchoolRepo( convertedData, schoolId );
    const data: any =  await getOneSchoolRepo( binaryToUuid(school.id) );
    return toSchoolResponse(data);   
}


export const deleteSchool = async ( schoolId: string ): Promise<void> => {
    await deleteSchoolRepo( schoolId );  
}

export const checkSchoolNameExist = async ( name: string, schoolId: any ): Promise<boolean>  => {
    return await checkSchoolNameExistRepo( name, schoolId );
}

export const checkIfInvalidSchoolId = async ( schoolIds: string[] ): Promise<boolean>  => {
    const convertedIds = schoolIds.map( item => uuidToBinary(item));
    return await checkIfInvalidSchoolIdRepo( convertedIds );
}