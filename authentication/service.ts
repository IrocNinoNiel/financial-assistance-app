import { binaryToUuid, ChangePasswordRequest, extractUserFromToken, LoginRequest, RegisterRequest } from "../utils";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from "./model";
import { changePasswordRepo, checkRoleRepo, checkUserExists, getPermission, getRoleRepo, registerRepo } from "./repository";
import { convertToUser, toUserPermissionResponse } from "../utils/converter";
import jwt from 'jsonwebtoken';
import { Prisma, student } from "@prisma/client";
import { checkIfStudentRepo, registerStudentRepo } from "../student/repository";

export const registerService = async ( data: RegisterRequest, isStudent: boolean = false ) => {

    if(isStudent) {
        const studentRole = await getRoleRepo("Student");
        data.roleId = binaryToUuid(studentRole.id);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user: User = convertToUser(data, hashedPassword);
    const result: any = await registerRepo(user);
    console.log("User data has been saved", result);

    const student = await checkIfStudentRepo(binaryToUuid(result.id));
    console.log("Check if user is student", student);

    if(student) {

        const studentData: Prisma.studentUncheckedCreateInput = {  
            user_id: result.id,
            first_name: result.first_name,
            last_name: result.last_name,
            email: result.email,
            mobile_number: result.mobile_number
        };
        
        const student: student = await registerStudentRepo(studentData);
        console.log("Student data has been saved", student);
    }



    const token = jwt.sign(
        { userId: binaryToUuid(result.id), email: result.email },
        process.env.SECRET_KEY, 
        { expiresIn: '1h' }
    );
    console.log("jwt has been sign");

    const permission: any[] = await getPermission(user.role_id);
    console.log("Get Role Permission", permission);
    const converted: any = toUserPermissionResponse(permission);
    console.log("Get Role Permission converted", converted);

    const userData =  {
        "user": result.email,
        "userId": binaryToUuid(result.id),
        "token": token,
        "permissions": converted
    };

    console.log("User data is created", userData)
    return userData

}

export const loginService = async ( data: LoginRequest ) => {

    const user: any = await checkUserExists(data.username);
    if (!user) {
        throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }  

    const token = jwt.sign(
        { userId: binaryToUuid(user.id), email: user.email },
        process.env.SECRET_KEY, 
        { expiresIn: '1h' }
    );

    const permission: any[] = await getPermission(user.role_id);
    const converted: any = toUserPermissionResponse(permission);

    return {
        "user": user.email,
        "userId": binaryToUuid(user.id),
        "token": token,
        "permissions": converted
    };
}

export const checkRole = async ( roleId: string) => {
    return checkRoleRepo(roleId);
}

export const changePasswordService = async ( data: ChangePasswordRequest, authHeader: any ) => {

    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    const hashedPassword = await bcrypt.hash(data.password, 10);

    await changePasswordRepo( userId, hashedPassword );
}