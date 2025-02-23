import { user } from "@prisma/client";
import { GetAllUsersParams, UserDetailsResponse, UserResponse } from "../utils";
import { toUserDetailResponse, toUserListResponse } from "../utils/converter";
import { doesUserExistRepo, getAllUsersRepo, getOneUserRepo, isAdminRepo } from "./repository"

export const isAdmin = async (userId: string) : Promise<boolean> => { 
    return isAdminRepo(userId);
}

export const getPermission = async (userId: string) : Promise<boolean> => { 
    // return await getPermissionRepo(userId);
    return true
}


export const getAllUsers = async (  ) => { 

    const data: any = await getAllUsersRepo();
    console.log(data);
    const converted = toUserListResponse(data);
    return { count: converted.length, users: converted};
}

export const doesUserExist = async ( userId: string ) : Promise<boolean> => {
    return await doesUserExistRepo( userId);
}


export const getOneUser = async ( userId: string ) : Promise<UserDetailsResponse> => {
    const data: user = await getOneUserRepo( userId);
    return toUserDetailResponse( data );
}
