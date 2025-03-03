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
    roleId?: string;
    mobileNumber: string;
    firstName: string;
    lastName: string;
    middleName: string;
}

export interface UpdateUserRequest {
  username: string;
  roleId?: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  middleName: string;
}

export interface SchoolPayload {
  name: string
  schoolType: string
  provinceId: number
  cityMunId: number
  brgyId: number
}

export interface AddressResponse {
  psgcCode?: string;
  regDesc?: string;
  regCode?: string;
  provDesc?: string;
  provCode?: string;
  citymunDesc?: string;
  citymunCode?: string;
  brgyCode?: string;
  brgyDesc?: string;
}

export interface RoleResponse {
  id: string;
  name: string;
  description: string;
}

export interface SchoolResponse {
  id: string;
  name: string;
  provinceId: string;
  provinceName?: string;
  cityMunId: string;
  cityMunName?: string;
  brgyId: string;
  brgyName?: string;
  schoolType: string;
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

export interface UserDetailsResponse {
  userId: string,
  email: string,
  roleId: string,
  firstName: string,
  middleName?: string,
  lastName: string, 
  mobileNumber: string
}


export interface PartialStudentUser {
  first_name: string,
  middle_name: string,
  last_name: string,
  mobile_number: string,
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
  g12SchoolId?: string;
  collegeProgramName?: string;
  collegeYearLevel?: number;
  collegeAwardHonor?: string;
  collegeOrganization?: string;
  collegeSchoolId?: string;
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
  studentId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  extensionName: string;
  sex: string;
  placeOfBirth: string;
  birthdate: Date;
  height: number;
  weight: number;
  permanentStreet: string;
  permanentBrgId: number;
  permanentCitymunId: number;
  permanentProvinceId: number;
  permanentRegionId: number;
  permanentZipCode: number;
  permanentCountry: string;
  currentStreet: string;
  currentBrgId: number;
  currentCitymunId: number;
  currentProvinceId: number;
  currentRegionId?: number;
  currentZipCode?: number;
  currentCountry?: string;
  email: string;
  mobileNumber: string;
  isSoloParent: boolean;
  isChildOfSoloParent: boolean;
  isIndigenousPeople: boolean;
  indigenousGroup?: string;
  isSped: boolean;
  isPwd: boolean;
  emergencyContactName: string;
  emergencyContactNumber: string;
  g12AcademicStrand?: string;
  g12ProgramName?: string;
  g12AwardHonor?: string;
  g12Organization?: string;
  g12YearOfGraduation?: number;
  g12SchoolId?: string;
  collegeProgramName?: string;
  collegeYearLevel?: number;
  collegeAwardHonor?: string;
  collegeOrganization?: string;
  collegeSchoolId?: string;
  fatherLastName: string;
  fatherFirstName: string;
  fatherMiddleName?: string;
  fatherExtension?: string;
  fatherOccupation: string;
  fatherIncome?: number;
  fatherMobileNumber: string;
  motherMaidenLastName: string;
  motherMaidenFirstName: string;
  motherMaidenMiddleName?: string;
  motherMaidenExtension?: string;
  motherOccupation: string;
  motherIncome?: number;
  motherMobileNumber: string;
  guardianLastName: string;
  guardianFirstName: string;
  guardianMiddleName?: string;
  guardianExtension?: string;
  guardianOccupation: string;
  guardianIncome?: number;
  guardianMobileNumber: string;
  numberOfSiblings: number;
  emergencyContactName2: string;
  emergencyContactNumber2: string;
  siblings: SiblingResponse[];
}

export type SiblingResponse = {
  studentId: string;
  siblingName: string;
  siblingBdate: Date;
  siblingAge: number;
  siblingStatus: string;
  livingWithParents: boolean;
  ownHouse: boolean;
};


export type Sibling = {
  student_id: number;
  sibling_name: string;
  sibling_bdate: Date;
  sibling_age: number;
  sibling_status: string;
  living_with_parents: boolean;
  own_house: boolean;
};

export type ChangePasswordRequest = {
  password: string;
  repassword: string;
}