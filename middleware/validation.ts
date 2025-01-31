import { error, LoginRequest, RegisterRequest } from "../utils";
import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../response/response";
import { checkEmailExists } from "../authentication/repository";
import { query, validationResult, body, param } from "express-validator";
import { checkStudentEmailExists } from "../student/repository";

const validRoles = [
  'Student',
  'System Admin',
  'Financial Assistance Coordinator',
  'Sponsor',
  'Budget Office',
  'Mayor’s Office',
  'Treasurer’s office',
  'Cashier',
  'Accounting'
];


export const validateLoginInput = async (req: Request, res: Response, next:NextFunction ) => {

    const data: LoginRequest = req.body;
    const errors: error[] = [];
  
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.username || !emailRegex.test(data.username)) {
      errors.push({ field: "username", message: "Invalid email format." });
    }
  
    // Validate password
    if (!data.password || data.password.trim().length === 0) {
      errors.push({ field: "password", message: "Password cannot be empty." });
    }

    if(errors.length > 0) {
        ResponseHandler.invalidRequest(req, res, errors)
    } else {
      console.log('Login validation passed, proceeding to next middleware');
      return next();
    }
}


export const validateRegisterInput = [
  body("username")
    .notEmpty().withMessage("Username is empty or invalid email.")
    .isEmail().withMessage("Invalid email address")
    .custom(async value => {
      const exists = await checkEmailExists(value);
        if (exists) {
          return Promise.reject('E-mail already in use');
      }
    }),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('repassword')
    .notEmpty().withMessage('Repassword is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password and repassword must match');
      }
      return true;
    }),
  body('role')
    .notEmpty().withMessage('User role is required')
    .custom(value => {
      if (!validRoles.includes(value)) {
        throw new Error('Invalid user role');
      }
      return true;
    }),
  body("name.firstName").notEmpty().withMessage("First name is required"),
  body("name.lastName").notEmpty().withMessage("Last name is required"),
  body("mobileNumber").notEmpty().withMessage("Invalid mobile number"),
  // Validation result handler
  async (req: Request, res: Response, next: NextFunction) => {
    
    const errors: any = validationResult(req);
    if (!errors.isEmpty()) {
      ResponseHandler.invalidRequest(req, res, errors);
    } else {
      next();
    }
  },

]

export const validateStudentRegistration = [
  
  // Personal Information
  body("name.firstName").notEmpty().withMessage("First name is required"),
  body("name.lastName").notEmpty().withMessage("Last name is required"),
  body("sex").isIn(["Male", "Female"]).withMessage("Invalid sex"),
  body("placeOfBirth").notEmpty().withMessage("Place of birth is required"),
  body("birthdate").isISO8601().withMessage("Invalid birthdate format"),
  body("height").isNumeric().withMessage("Height must be a number"),
  body("weight").isNumeric().withMessage("Weight must be a number"),
  body("address.permanent").notEmpty().withMessage("Permanent address is required"),
  body("address.current").notEmpty().withMessage("Current address is required"),
  body("email").isEmail().withMessage("Invalid email address").custom(async value => {
    const exists = await checkStudentEmailExists(value);
      if (exists) {
        return Promise.reject('E-mail already in use');
    }
  }),
  body("mobileNumber").notEmpty().withMessage("Invalid mobile number"),
  body("soloParent").isBoolean().withMessage("Solo parent must be true or false"),
  body("childOfSoloParent").isBoolean().withMessage("Child of solo parent must be true or false"),
  body("indigenous.isMember").isBoolean().withMessage("Is member of IP must be true or false"),
  body("indigenous.group").if(body("indigenous.isMember").equals("true")).notEmpty().withMessage("Indigenous group is required"),
  body("spEd").isBoolean().withMessage("SPED must be true or false"),
  body("pwd").isBoolean().withMessage("PWD must be true or false"),
  body("emergencyContact.fullName").notEmpty().withMessage("Emergency contact name is required"),
  body("emergencyContact.mobileNumber").notEmpty().withMessage("Invalid emergency contact number"),

  // Educational Background
  body("education.grade12.strand").notEmpty().withMessage("Academic strand is required"),
  body("education.grade12.schoolName").notEmpty().withMessage("School name is required"),
  body("education.grade12.schoolAddress").notEmpty().withMessage("School address is required"),
  body("education.grade12.yearOfGraduation").isInt().withMessage("Year of graduation must be a number"),

  // Family Background
  body("family.father.firstName").notEmpty().withMessage("Father's first name is required"),
  body("family.mother.firstName").notEmpty().withMessage("Mother's first name is required"),
  body("family.emergencyContact.fullName").notEmpty().withMessage("Emergency contact name is required"),

  // Custom validation logic for siblings array
  body("family.siblings").optional().isArray().withMessage("Siblings must be an array"),
  body("family.siblings.*.name").optional().notEmpty().withMessage("Sibling name is required"),
  body("family.siblings.*.age").optional().isInt().withMessage("Sibling age must be a number"),

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
