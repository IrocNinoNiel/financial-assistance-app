import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../response/response";
import { ERROR_MESSAGES } from "../utils";
import jwt from 'jsonwebtoken';

export async function authentication(req: Request, res: Response, next:NextFunction ) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        ResponseHandler.forbidden(req, res, ERROR_MESSAGES.INVALID_HEADER );
    } 
    
    const token = authHeader.split(' ')[1];

    try {
        jwt.verify(token, process.env.SECRET_KEY);
        console.log('API validation passed, proceeding to next middleware')
        next();
    } catch (err) {
        ResponseHandler.forbidden(req, res, ERROR_MESSAGES.INVALID_TOKEN );
    }
}