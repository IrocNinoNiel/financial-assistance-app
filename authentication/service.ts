import { binaryToUuid, ChangePasswordRequest, extractUserFromToken, LoginRequest, RegisterRequest, AuthResponse, uuidToBinary } from "../utils";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { changePasswordRepo, checkEmailExistsRepo, checkRoleRepo, checkUserExists, checkUsernameExistsRepo, getPermission, getRoleRepo, getUserDetails, getUserRoleRepo, registerRepo, getUserByEmailRepo, createPasswordResetTokenRepo, getPasswordResetTokenRepo, markTokenAsUsedRepo, resetPasswordRepo } from "./repository";
import { convertToUser, toUserPermissionResponse } from "../utils/converter";
import jwt from 'jsonwebtoken';
import { Prisma, student, user } from "@prisma/client";
import { checkIfStudentRepo, registerStudentRepo } from "../student/repository";
import { getOneStudentUsingUserId } from "../student/service";
import { sendPasswordResetEmail } from "../utils/email";

export const registerService = async ( data: RegisterRequest, isStudent: boolean = false ) => {

    if(isStudent) {
        const studentRole = await getRoleRepo("Student");
        data.roleId = binaryToUuid(studentRole.id);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user: Prisma.userUncheckedCreateInput = convertToUser(data, hashedPassword);
    const result: any = await registerRepo(user);
    console.log("User data has been saved", result);

    let studentId = null;
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
        studentId = binaryToUuid(student.id);
        console.log("Student data has been saved", student);
    }



    const token = jwt.sign(
        { userId: binaryToUuid(result.id), username: result.username },
        process.env.SECRET_KEY, 
        { expiresIn: '7D' }
    );
    console.log("jwt has been sign");

    const permission: any[] = await getPermission( binaryToUuid(user.role_id) );
    console.log("Get Role Permission", permission);
    const converted: any = toUserPermissionResponse(permission);
    console.log("Get Role Permission converted", converted);

    const userData: AuthResponse =  {
        "user": result.username,
        "studentId": studentId,
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
        { userId: binaryToUuid(user.id), username: user.username },
        process.env.SECRET_KEY, 
        { expiresIn: '7D' }
    );

    let studentId = null;
    const student = await checkIfStudentRepo(binaryToUuid(user.id));
    if(student) {
        const studentDetails: any = await getOneStudentUsingUserId(binaryToUuid(user.id));

        // another if to ensure that it is a student not a admin
        if( studentDetails ) {
            studentId = binaryToUuid(studentDetails.id);
        }
    }

    const permission: any[] = await getPermission( binaryToUuid(user.role_id) );
    const converted: any = toUserPermissionResponse(permission);

    return {
        user: user.username,
        userId: binaryToUuid(user.id),
        studentId: studentId,
        token: token,
        permissions: converted
    } as AuthResponse;
    
}

export const getAuthDetails = async( authHeader: any ) => {
    const userDetails = extractUserFromToken(authHeader);
    const user: user = await getUserDetails( userDetails.userId );
    const permission: any[] = await getPermission( binaryToUuid(user.role_id) );
    const converted: any = toUserPermissionResponse(permission);

    let studentId = null;
    const student = await checkIfStudentRepo(binaryToUuid(user.id));
    if(student) {
        const studentDetails: any = await getOneStudentUsingUserId(binaryToUuid(user.id));
        if( studentDetails ) {
            studentId = binaryToUuid(studentDetails.id);
        }
    }

    return {
        user: user.username,
        userId: binaryToUuid(user.id),
        studentId: studentId,
        permissions: converted
    } as AuthResponse;
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

export const checkEmailExists = async ( email: string, userId?: string ): Promise<Boolean> => {
    return checkEmailExistsRepo( email, userId);
}

export const checkUsernameExists  = async ( username: string, userId?: string ): Promise<Boolean> => {
    return checkUsernameExistsRepo( username, userId);
}

export const getUserRole = async ( userId: string ) => {
    return getUserRoleRepo( userId );
}

// Password Reset Services
export const forgotPasswordService = async (email: string): Promise<{ message: string }> => {
    const user = await getUserByEmailRepo(email);

    if (!user) {
        // Return success message even if user not found (security best practice)
        return { message: 'If an account with that email exists, a password reset link has been sent.' };
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Save token to database
    await createPasswordResetTokenRepo(user.id, resetToken, expiresAt);

    // Send email
    try {
        await sendPasswordResetEmail(email, resetToken);
    } catch (error) {
        console.error('Failed to send password reset email:', error);
        throw new Error('Failed to send password reset email. Please try again later.');
    }

    return { message: 'If an account with that email exists, a password reset link has been sent.' };
};

export const resetPasswordService = async (token: string, newPassword: string): Promise<{ message: string }> => {
    // Find valid token
    const resetToken = await getPasswordResetTokenRepo(token);

    if (!resetToken) {
        throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await resetPasswordRepo(resetToken.user_id, hashedPassword);

    // Mark token as used
    await markTokenAsUsedRepo(token);

    return { message: 'Password has been reset successfully' };
};

export const validateResetToken = async (token: string): Promise<{ valid: boolean }> => {
    const resetToken = await getPasswordResetTokenRepo(token);
    return { valid: resetToken !== null };
}