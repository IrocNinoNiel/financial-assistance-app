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
import academicYearController from "./academicYear/controller";
import sponsorshipController from "./sponsorship/controller";

const routes = Router();

routes.use(logger);
routes.use(parameters);
routes.use("/auth", authController());
routes.use("/roles", roleController());
routes.use('/students', authentication, authStudent, studentController());
routes.use("/file-uploads", authentication, fileController());
routes.use("/users", authentication, userController())
routes.use("/address", authentication, addressController());
routes.use("/schools", authentication, schoolController());
routes.use("/academic-years", authentication, academicYearController())
routes.use("/sponsorships", authentication, sponsorshipController())

routes.get("/verify", authentication, (req, res) => {
    res.json({ valid: true, message: "you have access to this api" });
})

export default routes;