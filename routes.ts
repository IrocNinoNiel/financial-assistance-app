import { Router } from "express";
import { logger } from "./middleware/logger";
import authController from "./authentication/controller";
import fileController from './file/controller';
import userController from './user/controller';
import addressController from './address/controller';
import { authAdmin, authentication, authStudent } from "./middleware/authentication";
import studentController from "./student/controller";

const routes = Router();

routes.use(logger);
routes.use("/user", authController());
routes.use('/students', authentication, authStudent, studentController());
routes.use("/file-upload", authentication, fileController());
routes.use("/users", authAdmin, userController())
routes.use("/address", authentication, addressController());

routes.get("/verify", authentication, (req, res) => {
    res.json({ valid: true, message: "you have access to this api" });
})

export default routes;