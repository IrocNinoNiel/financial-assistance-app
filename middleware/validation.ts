import { error, LoginRequest, RegisterRequest, VALIDATION_MESSAGES } from "../utils";
import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../response/response";
import { checkEmailExists } from "../authentication/repository";
import { query, validationResult, body, param } from "express-validator";
import { checkStudentEmailExists } from "../student/repository";
import { checkRole } from "../authentication/service";



export const validateLoginInput = async (req: Request, res: Response, next: NextFunction) => {
  const data: LoginRequest = req.body;
  const errors: error[] = [];

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.username || !emailRegex.test(data.username)) {
    errors.push({ field: "username", message: VALIDATION_MESSAGES.INVALID_EMAIL });
  }

  // Validate password
  if (!data.password || data.password.trim().length === 0) {
    errors.push({ field: "password", message: VALIDATION_MESSAGES.EMPTY_PASSWORD });
  }

  if (errors.length > 0) {
    ResponseHandler.invalidRequest(req, res, errors);
  } else {
    console.log('Login validation passed, proceeding to next middleware');
    return next();
  }
};

export const validateRegisterInput = [
  body("username")
    .notEmpty().withMessage(VALIDATION_MESSAGES.INVALID_EMAIL)
    .isEmail().withMessage(VALIDATION_MESSAGES.INVALID_EMAIL)
    .custom(async value => {
      const exists = await checkEmailExists(value);
      if (exists) {
        return Promise.reject(VALIDATION_MESSAGES.EMAIL_IN_USE);
      }
    }),
  body('password')
    .notEmpty().withMessage(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
    .isLength({ min: 6 }).withMessage(VALIDATION_MESSAGES.PASSWORD_LENGTH),
  body('repassword')
    .notEmpty().withMessage(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(VALIDATION_MESSAGES.PASSWORD_MISMATCH);
      }
      return true;
    }),
  body('roleId')
    .notEmpty().withMessage(VALIDATION_MESSAGES.INVALID_ROLE)
    .custom(async value => {

      const validRoles = await checkRole(value);
     
      if (!validRoles) {
        throw new Error(VALIDATION_MESSAGES.INVALID_ROLE);
      }
      return true;
    }),
  body("firstName").notEmpty().withMessage(VALIDATION_MESSAGES.FIRST_NAME_REQUIRED),
  body("lastName").notEmpty().withMessage(VALIDATION_MESSAGES.LAST_NAME_REQUIRED),
  body("mobileNumber").notEmpty().withMessage(VALIDATION_MESSAGES.INVALID_MOBILE_NUMBER),
  // Validation result handler
  async (req: Request, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req);
    if (!errors.isEmpty()) {
      ResponseHandler.invalidRequest(req, res, errors);
    } else {
      next();
    }
  },
];

export const validateStudentRegistration = [
  // Personal Information
  body("name.firstName").notEmpty().withMessage(VALIDATION_MESSAGES.FIRST_NAME_REQUIRED),
  body("name.lastName").notEmpty().withMessage(VALIDATION_MESSAGES.LAST_NAME_REQUIRED),
  body("sex").isIn(["Male", "Female"]).withMessage(VALIDATION_MESSAGES.INVALID_SEX),
  body("placeOfBirth").notEmpty().withMessage(VALIDATION_MESSAGES.PLACE_OF_BIRTH_REQUIRED),
  body("birthdate").isISO8601().withMessage(VALIDATION_MESSAGES.INVALID_BIRTHDATE),
  body("height").isNumeric().withMessage(VALIDATION_MESSAGES.HEIGHT_REQUIRED),
  body("weight").isNumeric().withMessage(VALIDATION_MESSAGES.WEIGHT_REQUIRED),
  body("address.permanent").notEmpty().withMessage(VALIDATION_MESSAGES.PERMANENT_ADDRESS_REQUIRED),
  body("address.current").notEmpty().withMessage(VALIDATION_MESSAGES.CURRENT_ADDRESS_REQUIRED),
  body("email").isEmail().withMessage(VALIDATION_MESSAGES.INVALID_EMAIL).custom(async value => {
    const exists = await checkStudentEmailExists(value);
    if (exists) {
      return Promise.reject(VALIDATION_MESSAGES.EMAIL_IN_USE);
    }
  }),
  body("mobileNumber").notEmpty().withMessage(VALIDATION_MESSAGES.INVALID_MOBILE_NUMBER),
  body("soloParent").isBoolean().withMessage(VALIDATION_MESSAGES.SOLO_PARENT_REQUIRED),
  body("childOfSoloParent").isBoolean().withMessage(VALIDATION_MESSAGES.CHILD_OF_SOLO_PARENT_REQUIRED),
  body("indigenous.isMember").isBoolean().withMessage(VALIDATION_MESSAGES.IP_MEMBERSHIP_REQUIRED),
  body("indigenous.group").if(body("indigenous.isMember").equals("true")).notEmpty().withMessage(VALIDATION_MESSAGES.INDIGENOUS_GROUP_REQUIRED),
  body("spEd").isBoolean().withMessage(VALIDATION_MESSAGES.SPED_REQUIRED),
  body("pwd").isBoolean().withMessage(VALIDATION_MESSAGES.PWD_REQUIRED),
  body("emergencyContact.fullName").notEmpty().withMessage(VALIDATION_MESSAGES.EMERGENCY_CONTACT_REQUIRED),
  body("emergencyContact.mobileNumber").notEmpty().withMessage(VALIDATION_MESSAGES.EMERGENCY_CONTACT_MOBILE_REQUIRED),

  // Educational Background
  body("education.grade12.strand").notEmpty().withMessage(VALIDATION_MESSAGES.ACADEMIC_STRAND_REQUIRED),
  body("education.grade12.schoolName").notEmpty().withMessage(VALIDATION_MESSAGES.SCHOOL_NAME_REQUIRED),
  body("education.grade12.schoolAddress").notEmpty().withMessage(VALIDATION_MESSAGES.SCHOOL_ADDRESS_REQUIRED),
  body("education.grade12.yearOfGraduation").isInt().withMessage(VALIDATION_MESSAGES.GRADUATION_YEAR_REQUIRED),

  // Family Background
  body("family.father.firstName").notEmpty().withMessage(VALIDATION_MESSAGES.FATHER_FIRST_NAME_REQUIRED),
  body("family.mother.firstName").notEmpty().withMessage(VALIDATION_MESSAGES.MOTHER_FIRST_NAME_REQUIRED),
  body("family.emergencyContact.fullName").notEmpty().withMessage(VALIDATION_MESSAGES.EMERGENCY_CONTACT_REQUIRED),

  // Custom validation logic for siblings array
  body("family.siblings").optional().isArray().withMessage(VALIDATION_MESSAGES.SIBLINGS_ARRAY_REQUIRED),
  body("family.siblings.*.name").optional().notEmpty().withMessage(VALIDATION_MESSAGES.SIBLING_NAME_REQUIRED),
  body("family.siblings.*.age").optional().isInt().withMessage(VALIDATION_MESSAGES.SIBLING_AGE_REQUIRED),

  // Validation result handler
  async (req: Request, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req);
    if (!errors.isEmpty()) {
      ResponseHandler.invalidRequest(req, res, errors);
    } else {
      next();
    }
  },
];