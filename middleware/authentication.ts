import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../response/response";
import { ERROR_MESSAGES, extractUserFromToken } from "../utils";
import jwt from 'jsonwebtoken';
import { isAdmin } from "../user/service";

export async function authentication(req: Request, res: Response, next:NextFunction ) {

   const token = await auth(req, res);

    if(token !== null) {
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

async function auth(req: Request, res: Response ) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        ResponseHandler.forbidden(req, res, ERROR_MESSAGES.INVALID_HEADER );
    } 
    
    const token = authHeader.split(' ')[1];

    try {
        jwt.verify(token, process.env.SECRET_KEY);
        console.log('API validation passed, proceeding to next middleware')
        return token;
    } catch (err) {
        return null;
    }
}