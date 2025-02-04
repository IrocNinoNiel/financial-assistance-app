import { Router } from "express";
import { logger } from "./middleware/logger";
import { validateLoginInput, validateRegisterInput } from "./middleware/validation";
import loginController from "./authentication/loginController";
import regController from "./authentication/regController";
import fileController from './file/controller';
import userController from './user/controller';
import { authAdmin, authentication } from "./middleware/authentication";
import studentController from "./student/controller";

const routes = Router();

routes.use(logger);
routes.use("/login", validateLoginInput, loginController());
routes.use("/register", validateRegisterInput, regController());
routes.use('/students', authentication, studentController());
routes.use("/file-upload", authentication, fileController());
routes.use("/users", authAdmin, userController())

routes.get("/verify", authentication, (req, res) => {
    res.json({ valid: true, message: "you have access to this api" });
})

export default routes;