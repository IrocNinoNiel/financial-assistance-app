import { EvaluationStatus, Prisma } from "@prisma/client";
import { APPLICATION_STAGE, APPLICATION_STATUS } from "./constant";

export interface LoginRequest {
    username: string;
    password: string;
}

export interface ErrorValidationResult {
    message: string;
    errors: error[];
}

export interface AuthResponse {
  user: string;
  studentId: string;
  userId: string;
  token: string;
  permissions: any[];

}

export interface error{ 
    field: string; message: string 
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    repassword: string;
    roleId?: string;
    mobileNumber: string;
    firstName: string;
    lastName: string;
    middleName: string;
}

export interface AcademicYearRequest {
  academicYearStart: number;
  academicYearEnd: number;
  schoolTerm: number;
  dateFrom: string;
  dateTo: string;
}

export interface AcademicYearResponse {
  id: string,
  academicYearStart: number;
  academicYearEnd: number;
  schoolTerm: number;
  dateFrom: string;
  dateTo: string;
}

export interface SponsorshipRequest {
  name: string,
  sponsorId: string,
  academicYearId: string,
  durationFrom: string,
  durationTo: string,
  batchNumber: number,
  limit: number,
  slot: number,
  fundAllocation: number,
  sponsorshipSchool: string[],
  sponsorshipRequirements: string[],
}
export interface ApplySponsorshipRequest {
  sponsorshipId: string,
  studentId: string,
}

export interface UserParameter {
  sponsor: string
}

export interface FileTypeResponse {
  id: string,
  name: string
}

export interface SponsorshipResponse {
  id: string,
  name: string,
  sponsorId: string,
  sponsorName: string,
  coordinatorId: string,
  coordinatorName: string,
  academicYearId: string,
  academicYearStart: number;
  academicYearEnd: number;
  durationFrom: string,
  durationTo: string,
  batchNumber: number,
  limit: number,
  slot: number,
  fundAllocation: number,
  status: string,
  studentCount: number,
  sponsorshipSchool: any[],
  sponsorshipRequirements: any[],
  students: any[],
}

export interface ApplySponsorshipResponse {
  appId: string,
  sponsorshipId: string,
  sponsorshipName: string,
  studentId: string,
  studentName: string,
  applicationDate: string,
  studentSex: string,
  cityMun: string,
  programName: string,
  yearLevel: string,
  sponsorshipStatus: string,
  sponsorshipStage: string,
  sponsorshipRemarks: string,
  sponsorshipRequirement?: SponReq[],
  studentFiles?: StudentFile[]
}
export interface SponReq {
  fileId: string,
  fileName: string
}

export interface StudentFile {
  fileName: string;
  fileType: string;
}

export interface UpdateUserRequest {
  email: string,
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

export const SponsorshipStatus = {
  ACTIVE: "active",
  FULL: "full",
  DELETED: "deleted"
}

export interface UserResponse {
    userId?: string,
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
  userId: string;
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
  username: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  mobileNumber: string;
  userId: string; 
  email: string;
  userType: string;
  userTypeId: string;
}

export interface GetAllUsersParams {
  search?: string;
  sort?: string;
  offset?: number;
  limit?: number;
}

export interface StudentListResponse {
  studentId: string;
  userId: string;
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
  permanentBrgyId: number;
  permanentBrgyName: string;
  permanentBrgyCode: string;
  permanentCitymunId: number;
  permanentCitymunName: string;
  permanentCitymunCode: string;
  permanentProvinceId: number;
  permanentProvinceName: string;
  permanentProvinceCode: string;
  permanentRegionId: number;
  permanentRegionName: string;
  permanentRegionCode: string;
  permanentZipCode: number;
  permanentCountry: string;
  currentStreet: string;
  currentBrgyId: number;
  currentBrgyName: string;
  currentBrgyCode: string;
  currentCitymunId: number;
  currentCitymunName: string;
  currentCitymunCode: string;
  currentProvinceId: number;
  currentProvinceName: string;
  currentProvinceCode: string;
  currentRegionId: number;
  currentRegionName: string;
  currentRegionCode: string;
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
  g12SchoolName?: string;
  collegeProgramName?: string;
  collegeYearLevel?: number;
  collegeAwardHonor?: string;
  collegeOrganization?: string;
  collegeSchoolId?: string;
  collegeSchoolName?: string;
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

export type UpdateStudentStatusRequest = {
  sponsorshipId: string;
  appStatus: APPLICATION_STATUS;
  appStage: APPLICATION_STAGE;
  interviewStatus?: EvaluationStatus;
  examStatus?: EvaluationStatus;
  remarks: string;
}

export type UpdateStudentStatus = {
  student_id: any;
  sponsorship_id: any;
  application_stage: APPLICATION_STAGE;
  application_status: APPLICATION_STATUS;
  exam_status?: EvaluationStatus;
  interview_status?: EvaluationStatus;
  remarks: string;
  updated_at: Date;
  updated_by: any;
}

export type SponsorshipMinimal = {

}

export type GetAllSponsorshipType = Prisma.sponsorshipGetPayload<{
  include: {
    _count: { select: { sponsorshipApplication: true } },
    academicYear: { select: { academic_year_start: true; academic_year_end: true } },
    sponsor: { select: { id: true; first_name: true; middle_name: true; last_name: true } },
    coordinator: { select: { id: true; first_name: true; middle_name: true; last_name: true } },
    schools: {
      include: {
        school: { select: { id: true; school_name: true } };
      };
    };
    requirements: {
      include: {
        fileType: { select: { id: true; name: true } };
      };
    };
    sponsorshipApplication: {
      include: {
        student: {
          select: {
            id: true;
            first_name: true;
            middle_name: true;
            last_name: true;
            user_id: true;
            files?
          };
        };
      };
    };
  };
}>;

export type  QueryParams = {
  offset: number;
  limit: number;
  search: string;
  sort: string;
}


export type AuthPayload = { email: string, userId: string }

export type AnnouncementPayloadString = {
  title: string;
  content: string;
  caption: string;
  targetMunicipalitys: number[];
  sponsorshipId: string;
}

export type UploadedAnnouncementFile = {
  filename: string;
  path: string;
  mime_type: string;
};

export type AnnouncementData = {
  id: Uint8Array;
  title: string;
  content: string;
  caption: string;
  sponsorship_id: Uint8Array;
  locations: {
      citymun: {
          id: number;
          citymun_desc: string;
      };
  }[];
  files: {
      id: Uint8Array;
      file_name: string;
      path: string;
  }[];
};


export type AnnouncementDataMinimal = {
  id: Uint8Array;
  title: string;
  content: string;
  caption: string;
  sponsorship_id: Uint8Array;
};

export type FlattenedAnnouncementData = {
  id: string; 
  title: string;
  content: string;
  caption: string;
  sponsorshipId: string;
  locations: { id: number; name: string }[];
  files: { fileName: string; path: string }[];
};

export type FlattenedAnnouncementDataMinimal = {
  id: string; 
  title: string;
  content: string;
  caption: string;
  sponsorshipId: string;
};

