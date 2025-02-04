import { GetAllUsersParams } from "../utils";
import { toUserListResponse } from "../utils/converter";
import { getAllUsersRepo, isAdminRepo } from "./repository"

export const isAdmin = async (userId: number) : Promise<boolean> => { 
    return isAdminRepo(userId);
}

export const getAllUsers = async (  ) => { 

    const data: any = await getAllUsersRepo();
    const converted = toUserListResponse(data);
    return { count: converted.length, users: converted};
}