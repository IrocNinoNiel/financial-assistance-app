import { error, LoginRequest, RegisterRequest, VALIDATION_MESSAGES } from "../utils";
import { NextFunction, Request, RequestHandler, Response } from "express";
import ResponseHandler from "../response/response";
import { validationResult, body, param } from "express-validator";
import { checkEmailExists, checkRole, checkUsernameExists } from "../authentication/service";
import { doesStudentExist, getOneStudent, getOneStudentUsingUserId, isEmailTakenByAnotherStudent } from "../student/service";
import { query } from "express-validator";
import { checkBarangayExist, checkCityMunExist, checkProvinceExist, checkRegionExist } from "../address/service";
import { checkIfNotSponsor, doesUserExist } from "../user/service";
import { checkIfInvalidSchoolId, checkSchoolExist, checkSchoolNameExist } from "../schools/service";
import { checkAcademicYearId, checkExistingAcademicYear } from "../academicYear/service";
import { checkIfSponsorshipExist, checkSponsorshipId, doesStudentAlreadyApplied } from "../sponsorship/service";
import { checkIfInvalidFileTypeId } from "../file/service";

export const validateLoginInput = async (req: Request, res: Response, next: NextFunction) => {
  const data: LoginRequest = req.body;
  const errors: error[] = [];

  // Validate email
  if (!data.username) {
    errors.push({ field: "username", message: VALIDATION_MESSAGES.USERNAME_INVALID });
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

const registerUserCommonValidation =  [
  body("username")
    .notEmpty().withMessage(VALIDATION_MESSAGES.USERNAME_INVALID)
    .custom(async value => {
      const exists = await checkUsernameExists(value);
      if (exists) {
        return Promise.reject(VALIDATION_MESSAGES.USERNAME_IN_USE);
      }
    }),
  body("email")
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
  body("firstName").notEmpty().withMessage(VALIDATION_MESSAGES.FIRST_NAME_REQUIRED),
  body("lastName").notEmpty().withMessage(VALIDATION_MESSAGES.LAST_NAME_REQUIRED),
  body("mobileNumber").notEmpty().withMessage(VALIDATION_MESSAGES.INVALID_MOBILE_NUMBER),
];

const validateErrors = async (req: Request, res: Response, next: NextFunction) => {
  const errors: any = validationResult(req);
  if (!errors.isEmpty()) {
    ResponseHandler.invalidRequest(req, res, errors);
  } else {
    next();
  }
};

export const validateRegisterInput = [
  ...registerUserCommonValidation,
  body('roleId')
    .notEmpty().withMessage(VALIDATION_MESSAGES.INVALID_ROLE)
    .custom(async value => {

      const validRoles = await checkRole(value);
     
      if (!validRoles) {
        throw new Error(VALIDATION_MESSAGES.INVALID_ROLE);
      }
      return true;
    }),
    validateErrors
];

export const validateUpdateUserInput = [
  param("userId")
    .notEmpty().withMessage(VALIDATION_MESSAGES.STUDENT_ID_REQUIRED)
    .custom(async (userId) => {
      const userExist = await doesUserExist(userId);
      if (!userExist) {
        return Promise.reject(VALIDATION_MESSAGES.USER_NOT_FOUND);
      }
  }),
  body("username")
    .notEmpty().withMessage(VALIDATION_MESSAGES.USERNAME_INVALID)
    .custom(async (value, {req}) => {
      const userId = req.params.userId
      const exists = await checkUsernameExists(value, userId);
      if (exists) {
        return Promise.reject(VALIDATION_MESSAGES.USERNAME_IN_USE);
      }
    }),
  body("email")
    .notEmpty().withMessage(VALIDATION_MESSAGES.EMAIL_INVALID)
    .isEmail().withMessage(VALIDATION_MESSAGES.EMAIL_INVALID)
    .custom(async (value, {req}) => {
      const userId = req.params.userId
      const exists = await checkEmailExists(value, userId);
      if (exists) {
        return Promise.reject(VALIDATION_MESSAGES.EMAIL_IN_USE);
      }
    }),
  body("firstName").notEmpty().withMessage(VALIDATION_MESSAGES.FIRST_NAME_REQUIRED),
  body("lastName").notEmpty().withMessage(VALIDATION_MESSAGES.LAST_NAME_REQUIRED),
  body("mobileNumber").notEmpty().withMessage(VALIDATION_MESSAGES.INVALID_MOBILE_NUMBER),
  body('roleId')
    .notEmpty().withMessage(VALIDATION_MESSAGES.INVALID_ROLE)
    .custom(async value => {

      const validRoles = await checkRole(value);
     
      if (!validRoles) {
        throw new Error(VALIDATION_MESSAGES.INVALID_ROLE);
      }
      return true;
    }),
    validateErrors
];

export const validateStudentRegisterInput = [
  ...registerUserCommonValidation,
    validateErrors
];


const commonValidationMiddleware = [
  body('firstName').isString().withMessage(VALIDATION_MESSAGES.FIRST_NAME_REQUIRED),
  body('lastName').isString().withMessage(VALIDATION_MESSAGES.LAST_NAME_REQUIRED),
  body('mobileNumber').notEmpty().withMessage(VALIDATION_MESSAGES.MOBILE_NUMBER_INVALID),
  body('sex').optional().isIn(['Male', 'Female', 'Other']).withMessage(VALIDATION_MESSAGES.SEX_INVALID),
  body('birthdate').optional().isDate().withMessage(VALIDATION_MESSAGES.BIRTHDATE_INVALID),
  body('height').optional().isFloat({ min: 0 }).withMessage(VALIDATION_MESSAGES.HEIGHT_INVALID),
  body('weight').optional().isFloat({ min: 0 }).withMessage(VALIDATION_MESSAGES.WEIGHT_INVALID),
  body('permanentStreet').optional().isString().withMessage(VALIDATION_MESSAGES.PERMANENT_ADDRESS_REQUIRED),

  // Current address fields
  body('currentStreet').optional().isString().withMessage(VALIDATION_MESSAGES.CURRENT_ADDRESS_REQUIRED),

  // Emergency contact fields
  body('emergencyContactName').optional().isString().withMessage(VALIDATION_MESSAGES.EMERGENCY_CONTACT_NAME_REQUIRED),
  body('emergencyContactNumber').optional().isString().withMessage(VALIDATION_MESSAGES.EMERGENCY_CONTACT_NUMBER_INVALID),

  // G12 Information
  body('g12AcademicStrand').optional().isString().withMessage(VALIDATION_MESSAGES.G12_ACADEMIC_STRAND_REQUIRED),
  body('g12ProgramName').optional().isString().withMessage(VALIDATION_MESSAGES.G12_PROGRAM_NAME_REQUIRED),
  body('g12YearOfGraduation').optional().isInt().withMessage(VALIDATION_MESSAGES.G12_YEAR_OF_GRADUATION_INVALID),

  // College Information
  body('collegeProgramName').optional().isString().withMessage(VALIDATION_MESSAGES.COLLEGE_PROGRAM_NAME_REQUIRED),
  body('collegeYearLevel').optional().isInt().withMessage(VALIDATION_MESSAGES.COLLEGE_YEAR_LEVEL_INVALID),

  // Father details
  body('fatherFirstName').optional().isString().withMessage(VALIDATION_MESSAGES.FATHER_FIRST_NAME_REQUIRED),
  body('fatherLastName').optional().isString().withMessage(VALIDATION_MESSAGES.FATHER_LAST_NAME_REQUIRED),
  body('fatherOccupation').optional().isString().withMessage(VALIDATION_MESSAGES.FATHER_OCCUPATION_REQUIRED),
  body('fatherMobileNumber').optional().isString().withMessage(VALIDATION_MESSAGES.FATHER_MOBILE_NUMBER_INVALID),

  // Mother details
  body('motherFirstName').optional().isString().withMessage(VALIDATION_MESSAGES.MOTHER_FIRST_NAME_REQUIRED),
  body('motherLastName').optional().isString().withMessage(VALIDATION_MESSAGES.MOTHER_LAST_NAME_REQUIRED),
  body('motherOccupation').optional().isString().withMessage(VALIDATION_MESSAGES.MOTHER_OCCUPATION_REQUIRED),
  body('motherMobileNumber').optional().notEmpty().withMessage(VALIDATION_MESSAGES.MOTHER_MOBILE_NUMBER_INVALID),

  // Guardian details
  body('guardianFirstName').optional().isString().withMessage(VALIDATION_MESSAGES.GUARDIAN_FIRST_NAME_REQUIRED),
  body('guardianLastName').optional().isString().withMessage(VALIDATION_MESSAGES.GUARDIAN_LAST_NAME_REQUIRED),
  body('guardianOccupation').optional().isString().withMessage(VALIDATION_MESSAGES.GUARDIAN_OCCUPATION_REQUIRED),
  body('guardianMobileNumber').optional().isString().withMessage(VALIDATION_MESSAGES.GUARDIAN_MOBILE_NUMBER_INVALID),

  // Siblings
  body('siblings').isArray().optional().withMessage(VALIDATION_MESSAGES.SIBLINGS_REQUIRED),
  body('siblings.*.name').optional().isString().withMessage(VALIDATION_MESSAGES.SIBLING_NAME_REQUIRED),
  body('siblings.*.birthdate').optional().isDate().withMessage(VALIDATION_MESSAGES.SIBLING_BIRTHDATE_INVALID),
  body('siblings.*.age').optional().isInt({ min: 0 }).withMessage(VALIDATION_MESSAGES.SIBLING_AGE_INVALID),
  body('siblings.*.status').optional().isString().withMessage(VALIDATION_MESSAGES.SIBLING_STATUS_REQUIRED),
  body('siblings.*.livingWithParents').optional().isBoolean().withMessage(VALIDATION_MESSAGES.SIBLING_LIVING_WITH_PARENTS_INVALID),
  body('siblings.*.ownHouse').optional().isBoolean().withMessage(VALIDATION_MESSAGES.SIBLING_OWN_HOUSE_INVALID)
]


export const validateUpdateStudent = [
  param("studentId")
    .notEmpty().withMessage(VALIDATION_MESSAGES.STUDENT_ID_REQUIRED)
    .custom(async (studentId) => {
      const studentExists = await doesStudentExist(studentId);
      if (!studentExists) {
        return Promise.reject(VALIDATION_MESSAGES.STUDENT_NOT_FOUND);
      }
  }),
  body("userId")
  .notEmpty().withMessage(VALIDATION_MESSAGES.USER_ID_REQUIRED)
  .custom(async (userId) => {
    console.log("params", userId);
    const studentExists = await doesUserExist(userId);
    if (!studentExists) {
      return Promise.reject(VALIDATION_MESSAGES.USER_NOT_FOUND);
    }
  })
  .custom(async (userId) => {
    const haveData = await getOneStudentUsingUserId( userId );
    if( haveData === null ) {
      return Promise.reject(VALIDATION_MESSAGES.USER_NO_STUDENT_INFO); 
    }
  }),
  body("email")
  .notEmpty().withMessage(VALIDATION_MESSAGES.EMAIL_INVALID)
  .isEmail().withMessage(VALIDATION_MESSAGES.EMAIL_INVALID)
    .custom(async (value, { req }) => {

      const studentId = req.params.studentId;
      const exists = await isEmailTakenByAnotherStudent(value, studentId);
      if (exists) {
        return Promise.reject(VALIDATION_MESSAGES.EMAIL_IN_USE);
      }
    }),
  body('permanentBrgId').optional().isInt().withMessage(VALIDATION_MESSAGES.PERMANENT_BRG_ID_INVALID)
    .custom(async ( value ) => {

      const dontExist = await checkBarangayExist("", value);
      if (dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.PERMANENT_BRG_ID_NOT_FOUND);
      }
    }),
  body('permanentCitymunId').optional().isInt().withMessage(VALIDATION_MESSAGES.PERMANENT_CITYMUN_ID_INVALID)
    .custom(async ( value ) => {

      const dontExist = await checkCityMunExist("", value);
      if (dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.PERMANENT_CITYMUN_ID_NOT_FOUND);
      }
    }),
  body('permanentProvinceId').optional().isInt().withMessage(VALIDATION_MESSAGES.PERMANENT_PROVINCE_ID_INVALID)
    .custom(async ( value ) => {

      const dontExist = await checkProvinceExist("", value);
      if (dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.PERMANENT_PROVINCE_ID_NOT_FOUND);
      }
    }),
  body('permanentRegionId').optional().isInt().withMessage(VALIDATION_MESSAGES.PERMANENT_REGION_ID_INVALID)
    .custom(async ( value ) => {

      const dontExist = await checkRegionExist("", value);
      if (dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.PERMANENT_REGION_ID_NOT_FOUND);
      }
    }),
  body('currentBrgId').optional().isInt().withMessage(VALIDATION_MESSAGES.CURRENT_BRG_ID_INVALID)
    .custom(async ( value ) => {

      const dontExist = await checkBarangayExist("", value);
      if (dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.CURRENT_BRG_ID_NOT_FOUND);
      }
    }),
  body('currentCitymunId').optional().isInt().withMessage(VALIDATION_MESSAGES.CURRENT_CITYMUN_ID_INVALID)
    .custom(async ( value ) => {

      const dontExist = await checkCityMunExist("", value);
      if (dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.CURRENT_CITYMUN_ID_NOT_FOUND);
      }
    }),
  body('currentProvinceId').optional().isInt().withMessage(VALIDATION_MESSAGES.CURRENT_PROVINCE_ID_INVALID)
    .custom(async ( value ) => {

      const dontExist = await checkProvinceExist("", value);
      if (dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.CURRENT_PROVINCE_ID_NOT_FOUND);
      }
    }),
  body('currentRegionId').optional().isInt().withMessage(VALIDATION_MESSAGES.CURRENT_REGION_ID_INVALID)
    .custom(async ( value ) => {

      const dontExist = await checkRegionExist("", value);
      if (dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.CURRENT_REGION_ID_NOT_FOUND);
      }
    }),
  body('collegeSchoolId').optional().isString().withMessage(VALIDATION_MESSAGES.COLLEGE_SCHOOL_ID_INVALID)
    .custom(async ( value ) => {

      const dontExist = await checkSchoolExist(value);
      if (dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.COLLEGE_SCHOOL_ID_NOT_FOUND);
      }
    }),
  body('g12SchoolId').optional().isString().withMessage(VALIDATION_MESSAGES.G12_SCHOOL_ID_INVALID)
    .custom(async ( value ) => {

      const dontExist = await checkSchoolExist(value);
      if (dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.G12_SCHOOL_ID_NOT_FOUND);
      }
    }),
  ...commonValidationMiddleware,
  validateErrors
];

export const validateStudentRegistration = [
  body("email")
  .notEmpty().withMessage(VALIDATION_MESSAGES.EMAIL_INVALID)
  .isEmail().withMessage(VALIDATION_MESSAGES.EMAIL_INVALID)
  .custom(async value => {
    const exists = await checkEmailExists(value);
    if (exists) {
      return Promise.reject(VALIDATION_MESSAGES.EMAIL_IN_USE);
    }
  }),
  ...commonValidationMiddleware,
  validateErrors
];

export const validateRegionCode = [
  query("regCode")
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.MISSING_REGION)
    .isString()
    .withMessage(VALIDATION_MESSAGES.INVALID_REGION)
    .custom(async value => {
      const exists = await checkRegionExist(value);
      if (exists) {
        return Promise.reject(VALIDATION_MESSAGES.NOT_FOUND_REGION);
      }
    }),
  validateErrors
];

export const validateProvinceCode = [
  query("provinceCode")
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.MISSING_PROVINCE)
    .isString()
    .withMessage(VALIDATION_MESSAGES.INVALID_PROVINCE)
    .custom(async value => {
      const exists = await checkProvinceExist(value);
      if (exists) {
        return Promise.reject(VALIDATION_MESSAGES.NOT_FOUND_PROVINCE);
      }
    }),
  validateErrors
];

export const validateCityMunCode = [
  query("citymunCode")
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.MISSING_CITYMUN)
    .isString()
    .withMessage(VALIDATION_MESSAGES.INVALID_CITYMUN)
    .custom(async value => {
      const exists = await checkCityMunExist(value);
      if (exists) {
        return Promise.reject(VALIDATION_MESSAGES.NOT_FOUND_CITYMUN);
      }
    }),
  validateErrors
];

export const validateGetOneStudent = [
  param("userId")
    .notEmpty().withMessage(VALIDATION_MESSAGES.STUDENT_ID_REQUIRED)
    .custom(async (userId) => {
      console.log("params", userId);
      const studentExists = await doesUserExist(userId);
      if (!studentExists) {
        return Promise.reject(VALIDATION_MESSAGES.USER_NOT_FOUND);
      }
    })
    .custom(async (userId) => {
      const haveData = await getOneStudent( userId );
      if( haveData === null ) {
        return Promise.reject(VALIDATION_MESSAGES.USER_NO_STUDENT_INFO); 
      }
    }),
  validateErrors
];

export const validateUserId = [
  param("userId")
    .notEmpty().withMessage(VALIDATION_MESSAGES.STUDENT_ID_REQUIRED)
    .custom(async (userId) => {
      console.log("params", userId);
      const userExist = await doesUserExist(userId);
      if (!userExist) {
        return Promise.reject(VALIDATION_MESSAGES.USER_NOT_FOUND);
      }
  }),
  validateErrors
];

export const validateSchoolId = [
  param("schoolId")
    .notEmpty().withMessage(VALIDATION_MESSAGES.SCHOOL_ID_REQUIRED)
    .custom(async (schoolId) => {
      console.log("params", schoolId);
      const dontExist = await checkSchoolExist(schoolId);
      if (dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.SCHOOL_ID_NOT_FOUND);
      }
  }),
  validateErrors
];

export const validatePassword = [
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
  validateErrors
]

export const validateSchool = [
  body("name")
    .notEmpty().withMessage(VALIDATION_MESSAGES.SCHOOL_NAME_INVALID)
    .custom(async ( value, {req} ) => {
      const schoolId  = req.params.schoolId || null;
      const dontExist = await checkSchoolNameExist( value, schoolId );
      if (!dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.SCHOOL_NAME_ALREADY_EXIST);
      }
    }),
  body('schoolType')
    .isString()
    .trim()
    .toLowerCase()
    .isIn(['private', 'public'])
    .withMessage(VALIDATION_MESSAGES.SCHOOL_TYPE_INVALID),
  body('brgyId').isInt().withMessage(VALIDATION_MESSAGES.PERMANENT_BRG_ID_INVALID)
    .custom(async ( value ) => {

      const dontExist = await checkBarangayExist("", value);
      if (dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.BRG_ID_NOT_FOUND);
      }
    }),
  body('cityMunId').isInt().withMessage(VALIDATION_MESSAGES.CITYMUN_ID_INVALID)
    .custom(async ( value ) => {

      const dontExist = await checkCityMunExist("", value);
      if (dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.CITYMUN_ID_NOT_FOUND);
      }
    }),
  body('provinceId').isInt().withMessage(VALIDATION_MESSAGES.PROVINCE_ID_INVALID)
    .custom(async ( value ) => {

      const dontExist = await checkProvinceExist("", value);
      if (dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.PROVINCE_ID_NOT_FOUND);
      }
    }),
  validateErrors
]

export const validateAcademicYear = [
  body("academicYearStart").isInt().withMessage(VALIDATION_MESSAGES.ACADEMIC_YEAR_START_REQUIRED),
  body("academicYearEnd").isInt().withMessage(VALIDATION_MESSAGES.ACADEMIC_YEAR_END_REQUIRED),
  body("schoolTerm").isInt().withMessage(VALIDATION_MESSAGES.ACADEMIC_YEAR_TERM_REQUIRED)
    .custom(async (value, { req }) => {
      const { academicYearStart, academicYearEnd } = req.body;
      const academicYearId  = req.params.academicYearId || null;
      const existingAcademicYear = await checkExistingAcademicYear( academicYearStart, academicYearEnd, value, academicYearId );

      if (existingAcademicYear) {
        throw new Error(VALIDATION_MESSAGES.ACADEMIC_YEAR_ALREADY_EXISTS);
      }
    }),
  body("dateFrom").isISO8601().withMessage(VALIDATION_MESSAGES.ACADEMIC_YEAR_DATE_FROM_REQUIRED),
  body("dateTo").isISO8601().withMessage(VALIDATION_MESSAGES.ACADEMIC_YEAR_DATE_TO_REQUIRED),
  validateErrors
];

export const validateAcademicYearId = [
  param("academicYearId")
    .notEmpty().withMessage(VALIDATION_MESSAGES.ACADEMIC_YEAR_ID_REQUIRED)
    .custom(async ( academicYearId ) => {
      console.log("params", academicYearId);
      const dontExist = await checkAcademicYearId( academicYearId );
      if (dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.ACADEMIC_YEAR_ID_NOT_FOUND);
      }
  }),
  validateErrors
];

export const validateSponsorshipId = [
  param("sponsorshipId")
    .notEmpty().withMessage(VALIDATION_MESSAGES.SPONSORSHIP_ID_REQUIRED)
    .custom(async ( academicYearId ) => {
      console.log("params", academicYearId);
      const dontExist = await checkSponsorshipId( academicYearId );
      if (dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.SPONSORSHIP_ID_NOT_FOUND);
      }
  }),
  validateErrors
];

export const validateStudentId = [
  param("studentId")
    .notEmpty().withMessage(VALIDATION_MESSAGES.STUDENT_ID_REQUIRED)
    .custom(async (studentId) => {
      const studentExists = await doesStudentExist(studentId);
      if (!studentExists) {
        return Promise.reject(VALIDATION_MESSAGES.STUDENT_NOT_FOUND);
      }
  }),
  validateErrors
]

export const validateApplyScholarship = [
  body("studentId")
    .notEmpty().withMessage(VALIDATION_MESSAGES.STUDENT_ID_REQUIRED)
    .custom(async (studentId) => {
      const studentExists = await doesStudentExist(studentId);
      if (!studentExists) {
        return Promise.reject(VALIDATION_MESSAGES.STUDENT_NOT_FOUND);
      }
  }),
  body("sponsorshipId")
    .notEmpty().withMessage(VALIDATION_MESSAGES.SPONSORSHIP_ID_REQUIRED)
    .custom(async ( academicYearId ) => {
      console.log("params", academicYearId);
      const dontExist = await checkSponsorshipId( academicYearId );
      if (dontExist) {
        return Promise.reject(VALIDATION_MESSAGES.SPONSORSHIP_ID_NOT_FOUND);
      }
  }),
  body("studentId")
    .custom(async (studentId, { req }) => {

      const { sponsorshipId } = req.body;
      const studentAlreadyApplied = await doesStudentAlreadyApplied( studentId, sponsorshipId );
      if (studentAlreadyApplied) {
        return Promise.reject(VALIDATION_MESSAGES.STUDENT_ALREADY_APPLIED);
      }
  }),
  validateErrors
]

export const validateSponsorship =  [
  body("batchNumber").isInt().withMessage(VALIDATION_MESSAGES.SPONSORSHIP_BATCH_NUMBER_REQUIRED),
  body("durationFrom").isISO8601().withMessage(VALIDATION_MESSAGES.SPONSORSHIP_DURATION_FROM_REQUIRED),
  body("limit").isInt({min: 1}).withMessage(VALIDATION_MESSAGES.SPONSORSHIP_LIMIT_REQUIRED),
  body("slot").isInt({min: 1}).withMessage(VALIDATION_MESSAGES.SPONSORSHIP_SLOT_REQUIRED),
  body("fundAllocation").isFloat({ min: 0.01 }).withMessage(VALIDATION_MESSAGES.SPONSORSHIP_FUND_ALLOCATION_INVALID),
  body('name').isString().withMessage(VALIDATION_MESSAGES.SPONSORSHIP_NAME_REQUIRED)
    .custom( async (value, {req}) => {
      const batchNumber: number = req.body.batchNumber;
      const sponsorshipId  = req.params.sponsorshipId || null;
      const alreadyExist = await checkIfSponsorshipExist( value, batchNumber, sponsorshipId );

      if(alreadyExist) {
        throw new Error(VALIDATION_MESSAGES.SPONSORSHIP_NAME_INVALID);
      }
    }),
  body('sponsorId').isString().withMessage(VALIDATION_MESSAGES.SPONSORSHIP_SPONSOR_ID_REQUIRED)
    .custom( async (value) => {
      const notSponsor:boolean = await checkIfNotSponsor( value );
      if(notSponsor) {
        throw new Error(VALIDATION_MESSAGES.SPONSORSHIP_SPONSOR_ID_INVALID);
      }

    }),
  body('academicYearId').isString().withMessage(VALIDATION_MESSAGES.SPONSORSHIP_ACADEMIC_YEAR_ID_REQUIRED)
    .custom( async (value) => {
      const notAcademicYear = await checkAcademicYearId( value );

        if(notAcademicYear) {
          throw new Error(VALIDATION_MESSAGES.SPONSORSHIP_ACADEMIC_YEAR_ID_INVALID);
        }

    }),
  body("durationTo").isISO8601().withMessage(VALIDATION_MESSAGES.SPONSORSHIP_DURATION_TO_REQUIRED)
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.durationFrom)) {
        throw new Error(VALIDATION_MESSAGES.SPONSORSHIP_DURATION_INVALID);
      }
      return true;
    }),
  body("sponsorshipSchool")
    .isArray({ min: 1 })
    .withMessage(VALIDATION_MESSAGES.SPONSORSHIP_SCHOOL_REQUIRED)
    .custom( async (value) => {
      if (!value.every((item) => typeof item === "string" && item.trim() !== "")) {
        throw new Error(VALIDATION_MESSAGES.SPONSORSHIP_SCHOOL_INVALID);
      }
      
      const invalidSchoolId: boolean = await checkIfInvalidSchoolId( value ); 
      if (invalidSchoolId) {
        console.log("Invalid school here");
        throw new Error(VALIDATION_MESSAGES.SPONSORSHIP_SCHOOL_INVALID);
      }
    }),

  body("sponsorshipRequirements")
    .isArray({ min: 1 })
    .withMessage(VALIDATION_MESSAGES.SPONSORSHIP_REQUIREMENTS_REQUIRED)
    .custom( async (value) => {
      if (!value.every((item) => typeof item === "string" && item.trim() !== "")) {
        throw new Error(VALIDATION_MESSAGES.SPONSORSHIP_REQUIREMENTS_INVALID);
      }

      const invalidFileTypeId: boolean = await checkIfInvalidFileTypeId( value ); 
      if (invalidFileTypeId) {
        throw new Error(VALIDATION_MESSAGES.SPONSORSHIP_REQUIREMENTS_INVALID);
      }
    }),
  validateErrors
]