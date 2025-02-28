import { user } from "@prisma/client";
import { binaryToUuid, GetAllUsersParams, UpdateUserRequest, UserDetailsResponse, UserResponse, uuidToBinary } from "../utils";
import { toUserDetailResponse, toUserListResponse, toUserResponse } from "../utils/converter";
import { deleteUserRepo, doesUserExistRepo, getAllUsersRepo, getOneUserRepo, isAdminRepo, updateUserRepo } from "./repository"
import { checkIfStudentRepo, getOneStudentRepo, updateStudentRepo } from "../student/repository";

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

export const updateUserService = async ( data: UpdateUserRequest, userId: string ) : Promise<any> => {
    
    // get user details
    const user: user = await getOneUserRepo( userId);

    user.email = data.username;
    user.first_name = data.firstName;
    user.last_name = data.lastName;
    user.middle_name = data.middleName;
    user.mobile_number = data.mobileNumber;

    await updateUserRepo( user, userId);

    // check if student
    const checkStudent = await checkIfStudentRepo(userId);
    console.log("Check if user is student", checkStudent);

    if(checkStudent) {
        const student = await getOneStudentRepo(userId);

        student.first_name = data.firstName;
        student.last_name = data.lastName;
        student.middle_name = data.middleName;
        student.mobile_number = data.mobileNumber;

        await updateStudentRepo(student, student.id);
    }

    return toUserDetailResponse(user);
}

export const deleteUserService = async ( userId: string) => {
    await deleteUserRepo(userId);
}