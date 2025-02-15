export interface LoginRequest {
    username: string;
    password: string;
}

export interface ErrorValidationResult {
    message: string;
    errors: error[];
}

export interface error{ 
    field: string; message: string 
}

export interface RegisterRequest {
    username: string;
    password: string;
    repassword: string;
    roleId: number;
    mobileNumber: string;
    firstName: string;
    lastName: string;
    middleName: string;
}

export const RecordStatus = {
    DELETED: false,
    ACTIVE: true
}

export interface UserResponse {
    user_id?: string,
    email?: string,
    token?: string
}

export interface StudentRequest {
  firstName: string;
  middleName?: string;
  lastName?: string;
  extensionName?: string;
  sex?: string;
  placeOfBirth?: string;
  birthdate?: string;
  height?: number;
  weight?: number;
  permanentStreet?: string;
  permanentBrgId?: number;
  permanentCitymunId?: number;
  permanentProvinceId?: number;
  permanentRegionId?: number;
  permanentZipCode?: number;
  permanentCountry?: string;
  currentStreet?: string;
  currentBrgId?: number;
  currentCitymunId?: number;
  currentProvinceId?: number;
  currentRegionId?: number;
  currentZipCode?: number;
  currentCountry?: string;
  email?: string;
  mobileNumber?: string;
  isSoloParent?: boolean;
  isChildOfSoloParent?: boolean;
  isIndigenousPeople?: boolean;
  indigenousGroup?: string;
  isSped?: boolean;
  isPwd?: boolean;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  emergencyContactName2?: string;
  emergencyContactNumber2?: string;
  g12AcademicStrand?: string;
  g12ProgramName?: string;
  g12AwardHonor?: string;
  g12Organization?: string;
  g12YearOfGraduation?: number;
  g12SchoolId?: number;
  collegeProgramName?: string;
  collegeYearLevel?: number;
  collegeAwardHonor?: string;
  collegeOrganization?: string;
  collegeSchoolId?: number;
  fatherFirstName?: string;
  fatherMiddleName?: string;
  fatherLastName?: string;
  fatherExtension?: string;
  fatherOccupation?: string;
  fatherIncome?: number;
  fatherMobileNumber?: string;
  motherFirstName?: string;
  motherMiddleName?: string;
  motherLastName?: string;
  motherExtension?: string;
  motherOccupation?: string;
  motherIncome?: number;
  motherMobileNumber?: string;
  guardianFirstName?: string;
  guardianMiddleName?: string;
  guardianLastName?: string;
  guardianExtension?: string;
  guardianOccupation?: string;
  guardianIncome?: number;
  guardianMobileNumber?: string;
  numberOfSiblings?: number;
  siblings?: SiblingRequest[];
}


export interface SiblingRequest {
    name?: string;
    birthdate?: string;
    age?: number;
    status?: string;
    remarks?: string;
    livingWithParents?: boolean;
    ownHouse?: boolean;
}

export interface UserListResponse {
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  mobile_number: string;
  user_id: string; 
  email: string;
  user_type: string;
}

export interface GetAllUsersParams {
  search?: string;
  sort?: string;
  offset?: number;
  limit?: number;
}

export interface StudentListResponse {
  student_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  extension_name?: string;
  sex: string;
  place_of_birth: string;
  birthdate: Date;
  height?: number;
  weight?: number;
  permanent_address: string;
  current_address: string;
  email: string;
  mobile_number: string;
  is_solo_parent: boolean;
  is_child_of_solo_parent: boolean;
  is_indigenous_people: boolean;
  indigenous_group?: string;
  is_sped: boolean;
  is_pwd: boolean;
  emergency_contact_name: string;
  emergency_contact_number: string;
  academic_strand: string;
  program_name: string;
  award_honor?: string;
  organization?: string;
  school_name: string;
  school_address: string;
  school_type: string;
  year_of_graduation: number;
  current_program_name: string;
  current_year_level: number;
  current_award_honor?: string;
  current_organization?: string;
  current_school_name: string;
  current_school_address: string;
  current_school_type: string;
  father_last_name: string;
  father_first_name: string;
  father_middle_name?: string;
  father_extension?: string;
  father_occupation: string;
  father_income?: number;
  father_mobile_number: string;
  mother_maiden_last_name: string;
  mother_maiden_first_name: string;
  mother_maiden_middle_name?: string;
  mother_maiden_extension?: string;
  mother_occupation: string;
  mother_income?: number;
  mother_mobile_number: string;
  guardian_last_name: string;
  guardian_first_name: string;
  guardian_middle_name?: string;
  guardian_extension?: string;
  guardian_occupation: string;
  guardian_income?: number;
  guardian_mobile_number: string;
  number_of_siblings: number;
  emergency_contact_name2: string;
  emergency_contact_number2: string;
  application_form: string;
  siblings: Sibling[];
}



export type Sibling = {
  student_id: number;
  sibling_name: string;
  sibling_bdate: Date;
  sibling_age: number;
  sibling_status: string;
  living_with_parents: boolean;
  own_house: boolean;
};