export const ERROR_MESSAGES = {
    INVALID_REQUEST: 'The request is invalid.',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Access denied',
    NON_STUDENT_UNAUTHORIZED: 'Access denied only student can access this api',
    SERVER_ERROR: 'An unexpected error occurred',
    INVALID_NAME: 'Name is required',
    INVALID_ID: 'Invalid or missing category ID',
    INVALID_HEADER: 'Invalid Authorization in the header',
    INVALID_TOKEN: 'Invalid API Token'
};


export const SUCCESS_MESSAGES = {
    FILE_SAVED: "File successfully saved"
}

// validationMessages.ts

export const VALIDATION_MESSAGES = {
    FIRST_NAME_REQUIRED: 'First name is required and should be a string',
    LAST_NAME_REQUIRED: 'Last name is required and should be a string',
    EMAIL_INVALID: 'Invalid email address',
    MOBILE_NUMBER_INVALID: 'Invalid mobile number',
    SEX_INVALID: 'Sex must be Male, Female, or Other',
    BIRTHDATE_INVALID: 'Birthdate must be a valid date',
    HEIGHT_INVALID: 'Height must be a positive number',
    WEIGHT_INVALID: 'Weight must be a positive number',
    PERMANENT_ADDRESS_REQUIRED: 'Permanent street is required',
    PERMANENT_BRG_ID_INVALID: 'Permanent barangay ID must be an integer',
    PERMANENT_CITYMUN_ID_INVALID: 'Permanent city municipality ID must be an integer',
    PERMANENT_PROVINCE_ID_INVALID: 'Permanent province ID must be an integer',
    PERMANENT_REGION_ID_INVALID: 'Permanent region ID must be an integer',
    CURRENT_ADDRESS_REQUIRED: 'Current street is required',
    CURRENT_BRG_ID_INVALID: 'Current barangay ID must be an integer',
    CURRENT_CITYMUN_ID_INVALID: 'Current city municipality ID must be an integer',
    CURRENT_PROVINCE_ID_INVALID: 'Current province ID must be an integer',
    CURRENT_REGION_ID_INVALID: 'Current region ID must be an integer',
    EMERGENCY_CONTACT_NAME_REQUIRED: 'Emergency contact name is required',
    EMERGENCY_CONTACT_NUMBER_INVALID: 'Emergency contact number must be a valid phone number',
    G12_ACADEMIC_STRAND_REQUIRED: 'G12 academic strand is required',
    G12_PROGRAM_NAME_REQUIRED: 'G12 program name is required',
    G12_YEAR_OF_GRADUATION_INVALID: 'G12 year of graduation must be a valid year',
    G12_SCHOOL_ID_INVALID: 'G12 school ID must be an integer',
    COLLEGE_PROGRAM_NAME_REQUIRED: 'College program name is required',
    COLLEGE_YEAR_LEVEL_INVALID: 'College year level must be an integer',
    COLLEGE_SCHOOL_ID_INVALID: 'College school ID must be an integer',
    FATHER_FIRST_NAME_REQUIRED: 'Father\'s first name is required',
    FATHER_LAST_NAME_REQUIRED: 'Father\'s last name is required',
    FATHER_OCCUPATION_REQUIRED: 'Father\'s occupation is required',
    FATHER_MOBILE_NUMBER_INVALID: 'Father\'s mobile number must be valid',
    MOTHER_FIRST_NAME_REQUIRED: 'Mother\'s first name is required',
    MOTHER_LAST_NAME_REQUIRED: 'Mother\'s last name is required',
    MOTHER_OCCUPATION_REQUIRED: 'Mother\'s occupation is required',
    MOTHER_MOBILE_NUMBER_INVALID: 'Mother\'s mobile number must be valid',
    GUARDIAN_FIRST_NAME_REQUIRED: 'Guardian\'s first name is required',
    GUARDIAN_LAST_NAME_REQUIRED: 'Guardian\'s last name is required',
    GUARDIAN_OCCUPATION_REQUIRED: 'Guardian\'s occupation is required',
    GUARDIAN_MOBILE_NUMBER_INVALID: 'Guardian\'s mobile number must be valid',
    SIBLINGS_REQUIRED: 'Siblings must be an array of sibling objects',
    SIBLING_NAME_REQUIRED: 'Sibling name is required',
    SIBLING_BIRTHDATE_INVALID: 'Sibling birthdate must be a valid date',
    SIBLING_AGE_INVALID: 'Sibling age must be a positive integer',
    SIBLING_STATUS_REQUIRED: 'Sibling status is required',
    SIBLING_LIVING_WITH_PARENTS_INVALID: 'Sibling livingWithParents must be a boolean',
    SIBLING_OWN_HOUSE_INVALID: 'Sibling ownHouse must be a boolean',
    PASSWORD_EMPTY: "Invalid Password",
    EMAIL_IN_USE: "Email Already Used",
    PASSWORD_REQUIRED: "Password Required",
    PASSWORD_LENGTH: "Password Minimum length is 6",
    PASSWORD_MISMATCH: "Password Mismatch",
    INVALID_ROLE: "Invalid Role",
    INVALID_MOBILE_NUMBER: "Invalid Phone Number",
    INVALID_FILE_TYPE: "File must be pdf or docs"
};
  