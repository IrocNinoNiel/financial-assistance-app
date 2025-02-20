import { SchoolResponse } from "../utils";
import { toSchoolResponse } from "../utils/converter";
import { getSchoolsRepo } from "./repository";

export const getSchools = async (): Promise<SchoolResponse[]> => {

    const data: any[] = await getSchoolsRepo();
    const converted: SchoolResponse[] = toSchoolResponse(data);
   
    return converted;

}