import { Router } from "express";
import { logger } from "./middleware/logger";
import { validateLoginInput, validateRegisterInput, validateStudentRegistration } from "./middleware/validation";
import loginController from "./authentication/loginController";
import regController from "./authentication/regController";
import studentController from './student/controller';
import jwt from 'jsonwebtoken';
import { authentication } from "./middleware/authentication";

const routes = Router();

routes.use(logger);
routes.use("/login", validateLoginInput, loginController());
routes.use("/register", validateRegisterInput, regController());
routes.use('/student', authentication, validateStudentRegistration, studentController())

routes.get("/verify", authentication, (req, res) => {
    res.json({ valid: true, message: "you have access to this api" });
})

export default routes;