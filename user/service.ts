import { GetAllUsersParams } from "../utils";
import { getAllUsersRepo, isAdminRepo } from "./repository"

export const isAdmin = async (userId: number) : Promise<boolean> => { 
    return isAdminRepo(userId);
}

export const getAllUsers = async (  ) => { 

    const data = await getAllUsersRepo(  );
    return data;
}