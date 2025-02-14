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
    errors.push({ field: "username", message: VALIDATION_MESSAGES.EMAIL_INVALID });
  }

  // Validate password
  if (!data.password || data.password.trim().length === 0) {
    errors.push({ field: "password", message: VALIDATION_MESSAGES.PASSWORD_EMPTY });
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
    .notEmpty().withMessage(VALIDATION_MESSAGES.EMAIL_INVALID)
    .isEmail().withMessage(VALIDATION_MESSAGES.EMAIL_INVALID)
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

  body('firstName').isString().withMessage(VALIDATION_MESSAGES.FIRST_NAME_REQUIRED),
  body('lastName').isString().withMessage(VALIDATION_MESSAGES.LAST_NAME_REQUIRED),
  body('email').isEmail().withMessage(VALIDATION_MESSAGES.EMAIL_INVALID),
  body('mobileNumber').notEmpty().withMessage(VALIDATION_MESSAGES.MOBILE_NUMBER_INVALID),
  body('sex').isIn(['Male', 'Female', 'Other']).withMessage(VALIDATION_MESSAGES.SEX_INVALID),
  body('birthdate').isDate().withMessage(VALIDATION_MESSAGES.BIRTHDATE_INVALID),
  body('height').optional().isFloat({ min: 0 }).withMessage(VALIDATION_MESSAGES.HEIGHT_INVALID),
  body('weight').optional().isFloat({ min: 0 }).withMessage(VALIDATION_MESSAGES.WEIGHT_INVALID),
  body('permanentStreet').isString().withMessage(VALIDATION_MESSAGES.PERMANENT_ADDRESS_REQUIRED),
  body('permanentBrgId').isInt().withMessage(VALIDATION_MESSAGES.PERMANENT_BRG_ID_INVALID),
  body('permanentCitymunId').isInt().withMessage(VALIDATION_MESSAGES.PERMANENT_CITYMUN_ID_INVALID),
  body('permanentProvinceId').isInt().withMessage(VALIDATION_MESSAGES.PERMANENT_PROVINCE_ID_INVALID),
  body('permanentRegionId').isInt().withMessage(VALIDATION_MESSAGES.PERMANENT_REGION_ID_INVALID),

  // Current address fields
  body('currentStreet').isString().withMessage(VALIDATION_MESSAGES.CURRENT_ADDRESS_REQUIRED),
  body('currentBrgId').isInt().withMessage(VALIDATION_MESSAGES.CURRENT_BRG_ID_INVALID),
  body('currentCitymunId').isInt().withMessage(VALIDATION_MESSAGES.CURRENT_CITYMUN_ID_INVALID),
  body('currentProvinceId').isInt().withMessage(VALIDATION_MESSAGES.CURRENT_PROVINCE_ID_INVALID),
  body('currentRegionId').isInt().withMessage(VALIDATION_MESSAGES.CURRENT_REGION_ID_INVALID),

  // Emergency contact fields
  body('emergencyContactName').isString().withMessage(VALIDATION_MESSAGES.EMERGENCY_CONTACT_NAME_REQUIRED),
  body('emergencyContactNumber').notEmpty().withMessage(VALIDATION_MESSAGES.EMERGENCY_CONTACT_NUMBER_INVALID),

  // G12 Information
  body('g12AcademicStrand').isString().withMessage(VALIDATION_MESSAGES.G12_ACADEMIC_STRAND_REQUIRED),
  body('g12ProgramName').isString().withMessage(VALIDATION_MESSAGES.G12_PROGRAM_NAME_REQUIRED),
  body('g12YearOfGraduation').isInt().withMessage(VALIDATION_MESSAGES.G12_YEAR_OF_GRADUATION_INVALID),
  body('g12SchoolId').isInt().withMessage(VALIDATION_MESSAGES.G12_SCHOOL_ID_INVALID),

  // College Information
  body('collegeProgramName').isString().withMessage(VALIDATION_MESSAGES.COLLEGE_PROGRAM_NAME_REQUIRED),
  body('collegeYearLevel').isInt().withMessage(VALIDATION_MESSAGES.COLLEGE_YEAR_LEVEL_INVALID),
  body('collegeSchoolId').isInt().withMessage(VALIDATION_MESSAGES.COLLEGE_SCHOOL_ID_INVALID),

  // Father details
  body('fatherFirstName').isString().withMessage(VALIDATION_MESSAGES.FATHER_FIRST_NAME_REQUIRED),
  body('fatherLastName').isString().withMessage(VALIDATION_MESSAGES.FATHER_LAST_NAME_REQUIRED),
  body('fatherOccupation').isString().withMessage(VALIDATION_MESSAGES.FATHER_OCCUPATION_REQUIRED),
  body('fatherMobileNumber').notEmpty().withMessage(VALIDATION_MESSAGES.FATHER_MOBILE_NUMBER_INVALID),

  // Mother details
  body('motherFirstName').isString().withMessage(VALIDATION_MESSAGES.MOTHER_FIRST_NAME_REQUIRED),
  body('motherLastName').isString().withMessage(VALIDATION_MESSAGES.MOTHER_LAST_NAME_REQUIRED),
  body('motherOccupation').isString().withMessage(VALIDATION_MESSAGES.MOTHER_OCCUPATION_REQUIRED),
  body('motherMobileNumber').notEmpty().withMessage(VALIDATION_MESSAGES.MOTHER_MOBILE_NUMBER_INVALID),

  // Guardian details
  body('guardianFirstName').isString().withMessage(VALIDATION_MESSAGES.GUARDIAN_FIRST_NAME_REQUIRED),
  body('guardianLastName').isString().withMessage(VALIDATION_MESSAGES.GUARDIAN_LAST_NAME_REQUIRED),
  body('guardianOccupation').isString().withMessage(VALIDATION_MESSAGES.GUARDIAN_OCCUPATION_REQUIRED),
  body('guardianMobileNumber').notEmpty().withMessage(VALIDATION_MESSAGES.GUARDIAN_MOBILE_NUMBER_INVALID),

  // Siblings
  body('siblings').isArray().withMessage(VALIDATION_MESSAGES.SIBLINGS_REQUIRED),
  body('siblings.*.name').isString().withMessage(VALIDATION_MESSAGES.SIBLING_NAME_REQUIRED),
  body('siblings.*.birthdate').isDate().withMessage(VALIDATION_MESSAGES.SIBLING_BIRTHDATE_INVALID),
  body('siblings.*.age').isInt({ min: 0 }).withMessage(VALIDATION_MESSAGES.SIBLING_AGE_INVALID),
  body('siblings.*.status').isString().withMessage(VALIDATION_MESSAGES.SIBLING_STATUS_REQUIRED),
  body('siblings.*.livingWithParents').isBoolean().withMessage(VALIDATION_MESSAGES.SIBLING_LIVING_WITH_PARENTS_INVALID),
  body('siblings.*.ownHouse').isBoolean().withMessage(VALIDATION_MESSAGES.SIBLING_OWN_HOUSE_INVALID),

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