import { binaryToUuid, LoginRequest, RegisterRequest, UserResponse, uuidToBinary } from "../utils";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from "./model";
import { checkUserExists, getRoleRepo, registerRepo, saveUserRoleRepo } from "./repository";
import { convertToUser, toUserResponse } from "../utils/converter";
import jwt from 'jsonwebtoken';

export const registerService = async ( data: RegisterRequest ) => {

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userId = uuidv4();

    const user: User = convertToUser(data, hashedPassword, userId);

    console.log("User data to be save", user);
    const result: any = await registerRepo(user);

    const role = await getRoleRepo(data.role);

    const userRole: UserRole = { user_id: result.id, role_id: role.id };
    console.log("Role to be saved",userRole);
    await saveUserRoleRepo(userRole);
    
    const token = jwt.sign(
        { userId: result.id, email: result.email },
        process.env.SECRET_KEY, 
        { expiresIn: '1h' }
    );

    const userData =  {
        "user": result.email,
        "token": token,
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

    return {
        "user": user.email,
        "token": token,
    };
}