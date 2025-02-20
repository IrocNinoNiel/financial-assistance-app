import { RoleResponse } from "../utils";
import { toRolesResponse } from "../utils/converter";
import { getRolesRepo } from "./repository";

export const getRoles = async (): Promise<RoleResponse[]> => {

    const data: any[] = await getRolesRepo();
    const converted: RoleResponse[] = toRolesResponse(data);
   
    return converted;

}