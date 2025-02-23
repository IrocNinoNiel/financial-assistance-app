import { SchoolResponse } from "../utils";
import { toSchoolResponse } from "../utils/converter";
import { checkSchoolExistRepo, getSchoolsRepo } from "./repository";

export const getSchools = async (): Promise<SchoolResponse[]> => {

    const data: any[] = await getSchoolsRepo();
    const converted: SchoolResponse[] = toSchoolResponse(data);
   
    return converted;

}

export const checkSchoolExist = async ( id: string): Promise<Boolean> => {
    return checkSchoolExistRepo( id );
}