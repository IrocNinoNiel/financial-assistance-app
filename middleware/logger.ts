import { NextFunction, Request, Response } from "express";

export function logger(req: Request, res: Response, next:NextFunction ) { 
    console.log("url: ", req.url);
    console.log("params: ", req.params);
    console.log("query: ", req.query);
    console.log("body: ", req.body);
    next();
}