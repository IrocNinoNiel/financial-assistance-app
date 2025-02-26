import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../response/response";
import { ERROR_MESSAGES, extractUserFromToken } from "../utils";
import jwt from 'jsonwebtoken';
import { getPermission, isAdmin } from "../user/service";
import { checkStudent } from "../student/service";

export async function authentication(req: Request, res: Response, next:NextFunction ) {

   const token = await auth(req, res);

    if(token !== null) {
        console.log('General authentication passed, proceeding to next middleware')
        next()
    } else {
        ResponseHandler.forbidden(req, res, ERROR_MESSAGES.INVALID_TOKEN );
    }
}

export async function authAdmin(req: Request, res: Response, next: NextFunction) {
    try {
    const authenticated = await auth(req, res);

    if (authenticated) {
        const authHeader = req.headers.authorization;
        const userDetails = extractUserFromToken(authHeader);
        const admin = await isAdmin(userDetails.userId);

        if (admin) {
            next();
        } else {
            ResponseHandler.forbidden(req, res, ERROR_MESSAGES.UNAUTHORIZED);
        }
    } else {
        ResponseHandler.forbidden(req, res, ERROR_MESSAGES.INVALID_TOKEN);
    }
    } catch (error) {
        console.error('Error in authAdmin middleware:', error);
        ResponseHandler.forbidden(req, res, ERROR_MESSAGES.SERVER_ERROR);
    }
}

export async function authStudent(req: Request, res: Response, next: NextFunction) {
    try {
    const authenticated = await auth(req, res);

    if (authenticated) {
        const authHeader = req.headers.authorization;
        const userDetails = extractUserFromToken(authHeader);
        const student = await checkStudent(userDetails.userId);

        if (student) {
            console.log('Student authentication passed, proceeding to next middleware')
            next();
        } else {
            ResponseHandler.forbidden(req, res, ERROR_MESSAGES.NON_STUDENT_UNAUTHORIZED);
        }
    } else {
        ResponseHandler.forbidden(req, res, ERROR_MESSAGES.INVALID_TOKEN);
    }
    } catch (error) {
        console.error('Error in authAdmin middleware:', error);
        ResponseHandler.forbidden(req, res, ERROR_MESSAGES.SERVER_ERROR);
    }
}





async function auth(req: Request, res: Response ) {

    try {
        const authHeader = req.headers.authorization; 
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY);
        return token;
    } catch (err) {
        return null;
    }
}

export async function permission(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const userDetails = extractUserFromToken(authHeader);
    const admin = await getPermission(userDetails.userId);

    if (admin) {
        next();
    } else {
        ResponseHandler.forbidden(req, res, ERROR_MESSAGES.UNAUTHORIZED);
    }
}