import { Prisma } from "@prisma/client";
import { binaryToUuid, SchoolPayload, SchoolResponse } from "../utils";
import { toSchoolModel, toSchoolResponse } from "../utils/converter";
import { checkSchoolExistRepo, checkSchoolNameExistRepo, createSchoolRepo, getOneSchoolRepo, getSchoolsRepo, updateSchoolRepo } from "./repository";

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
    const convertedData: Prisma.schoolsUncheckedCreateInput = toSchoolModel(payload);
    const school = await createSchoolRepo( convertedData );
    const data: any =  await getOneSchoolRepo( binaryToUuid(school.id) );
    return toSchoolResponse(data);   
}

export const updateSchool = async ( payload: SchoolPayload, schoolId: string ): Promise<SchoolResponse> => {
    const convertedData: Prisma.schoolsUncheckedCreateInput = toSchoolModel(payload);
    const school = await updateSchoolRepo( convertedData, schoolId );
    const data: any =  await getOneSchoolRepo( binaryToUuid(school.id) );
    return toSchoolResponse(data);   
}


export const checkSchoolNameExist = async ( name: string, schoolId: any ): Promise<boolean>  => {
    return await checkSchoolNameExistRepo( name, schoolId );
}