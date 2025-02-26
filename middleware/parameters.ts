import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response, Router } from "express";
import { query, validationResult, body, param } from "express-validator";

const queryParamValidators = {
  search: query("search").optional().isString(),
};

const parameters = [
    queryParamValidators.search,
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            next();
        } else {
            res
                .status(HttpStatusCode.BadRequest)
                .json({ errors: errors.array({ onlyFirstError: true }) });
        }
    },
];
    
export default parameters;