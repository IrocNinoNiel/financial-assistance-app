import { Router } from "express";
import { logger } from "./middleware/logger";
import authController from "./authentication/controller";
import fileController from './file/controller';
import userController from './user/controller';
import addressController from './address/controller';
import roleController from './roles/controller';
import schoolController from './schools/controller';
import { authAdmin, authentication, authStudent } from "./middleware/authentication";
import studentController from "./student/controller";
import parameters from "./middleware/parameters";

const routes = Router();

routes.use(logger);
routes.use(parameters);
routes.use("/user", authController());
routes.use("/roles", roleController());
routes.use('/students', authentication, authStudent, studentController());
routes.use("/file-upload", authentication, fileController());
routes.use("/users", authentication, userController())
routes.use("/address", authentication, addressController());
routes.use("/schools", authentication, schoolController());

routes.get("/verify", authentication, (req, res) => {
    res.json({ valid: true, message: "you have access to this api" });
})

export default routes;