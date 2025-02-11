import { binaryToUuid, LoginRequest, RegisterRequest, UserResponse, uuidToBinary } from "../utils";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from "./model";
import { checkRoleRepo, checkUserExists, getPermission, getRoleRepo, registerRepo } from "./repository";
import { convertToUser, toUserPermissionResponse } from "../utils/converter";
import jwt from 'jsonwebtoken';

export const registerService = async ( data: RegisterRequest ) => {

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userId = uuidv4();

    const user: User = convertToUser(data, hashedPassword, userId);

    console.log("User data to be save", user);
    const result: any = await registerRepo(user);

    const token = jwt.sign(
        { userId: result.id, email: result.email },
        process.env.SECRET_KEY, 
        { expiresIn: '1h' }
    );

    const permission: any[] = await getPermission(user.role_id);
    const converted: any = toUserPermissionResponse(permission);

    const userData =  {
        "user": result.email,
        "userId": binaryToUuid(result.user_id),
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
        { userId: user.id, email: user.email },
        process.env.SECRET_KEY, 
        { expiresIn: '1h' }
    );

    const permission: any[] = await getPermission(user.role_id);
    const converted: any = toUserPermissionResponse(permission);

    console.log(user);

    return {
        "user": user.email,
        "userId": binaryToUuid(user.user_id),
        "token": token,
        "permissions": converted
    };
}

export const checkRole = async ( roleId: number) => {
    return checkRoleRepo(roleId);
}