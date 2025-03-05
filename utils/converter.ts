
import { Prisma, student, user, academicYear } from '@prisma/client';
import { User } from "../authentication/model";
import { AcademicYearRequest, AcademicYearResponse, AddressResponse, PartialStudentUser, RegisterRequest, RoleResponse, SchoolPayload, SiblingRequest, StudentListResponse, StudentRequest, UserDetailsResponse, UserListResponse, UserResponse } from './types';
import { binaryToUuid, uuidToBinary } from "./utils";

export function convertStudentResponseToStudent(response: StudentRequest, userId: string): Prisma.studentUncheckedCreateInput  {
  return {
    user_id: uuidToBinary(userId),
    first_name: response.firstName,
    middle_name: response.middleName,
    last_name: response.lastName,
    extension_name: response.extensionName,
    sex: response.sex,
    place_of_birth: response.placeOfBirth,
    birthdate: new Date(response.birthdate),
    height: response.height,
    weight: response.weight,
    permanent_street: response.permanentStreet,
    permanent_brg_id: response.permanentBrgId,
    permanent_citymun_id: response.permanentCitymunId,
    permanent_province_id: response.permanentProvinceId,
    permanent_region_id: response.permanentRegionId,
    permanent_zip_code: response.permanentZipCode,
    permanent_country: response.permanentCountry,
    current_street: response.currentStreet,
    current_brg_id: response.currentBrgId,
    current_citymun_id: response.currentCitymunId,
    current_province_id: response.currentProvinceId,
    current_region_id: response.currentRegionId,
    current_zip_code: response.currentZipCode,
    current_country: response.currentCountry,
    g12_academic_strand: response.g12AcademicStrand,
    g12_program_name: response.g12ProgramName,
    g12_award_honor: response.g12AwardHonor,
    g12_organization: response.g12Organization,
    g12_year_of_graduation: response.g12YearOfGraduation,
    g12_school_id: uuidToBinary(response.g12SchoolId),
    college_program_name: response.collegeProgramName,
    college_year_level: response.collegeYearLevel,
    college_award_honor: response.collegeAwardHonor,
    college_organization: response.collegeOrganization,
    college_school_id: uuidToBinary(response.collegeSchoolId),
    email: response.email,
    mobile_number: response.mobileNumber,
    is_solo_parent: response.isSoloParent,
    is_child_of_solo_parent: response.isChildOfSoloParent,
    is_indigenous_people: response.isIndigenousPeople,
    indigenous_group: response.indigenousGroup,
    is_sped: response.isSped,
    is_pwd: response.isPwd,
    emergency_contact_name: response.emergencyContactName,
    emergency_contact_number: response.emergencyContactNumber,
    emergency_contact_name2: response.emergencyContactName2,
    emergency_contact_number2: response.emergencyContactNumber2,
    father_first_name: response.fatherFirstName,
    father_middle_name: response.fatherMiddleName,
    father_last_name: response.fatherLastName,
    father_extension: response.fatherExtension,
    father_occupation: response.fatherOccupation,
    father_income: response.fatherIncome,
    father_mobile_number: response.fatherMobileNumber,
    mother_maiden_first_name: response.motherFirstName,
    mother_maiden_middle_name: response.motherMiddleName,
    mother_maiden_last_name: response.motherLastName,
    mother_maiden_extension: response.motherExtension,
    mother_occupation: response.motherOccupation,
    mother_income: response.motherIncome,
    mother_mobile_number: response.motherMobileNumber,
    guardian_first_name: response.guardianFirstName,
    guardian_middle_name: response.guardianMiddleName,
    guardian_last_name: response.guardianLastName,
    guardian_extension: response.guardianExtension,
    guardian_occupation: response.guardianOccupation,
    guardian_income: response.guardianIncome,
    guardian_mobile_number: response.guardianMobileNumber,
    number_of_siblings: response.numberOfSiblings,
    created_by: uuidToBinary(userId),
    updated_by: uuidToBinary(userId),
    updated_at: new Date(),
    record_status: true
    
  };
}

export function convertToStudentUser(response: any): PartialStudentUser {
  return {
    first_name: response.firstName,
    middle_name: response.middleName,
    last_name: response.lastName,
    mobile_number: response.mobileNumber
  }
}



export function convertToSiblingData(studentId: string,  siblingRequests: SiblingRequest[]): Prisma.siblingUncheckedCreateInput[] {
  return siblingRequests.map(sibling => ({
      student_id: uuidToBinary(studentId),
      sibling_name: sibling.name,
      sibling_bdate: new Date(sibling.birthdate),
      sibling_age: sibling.age,
      living_with_parents: sibling.livingWithParents,
      sibling_status: sibling.status as "Single" | "Married" | "Divorced" | "Widowed",
      own_house: sibling.ownHouse,
      created_by: uuidToBinary(studentId),
      updated_by: uuidToBinary(studentId)
  }));
}

export function convertToUser(data: RegisterRequest, hashedPassword: any ): User {
   return {
      email: data.username,
      password: hashedPassword,
      last_name:  data.lastName,
      first_name: data.firstName,
      middle_name: data.middleName,
      mobile_number: data.mobileNumber,
      role_id: uuidToBinary(data.roleId)
  }
}

export function toUserResponse(user: any): UserListResponse {
  return {
    firstName: user.first_name,
    middleName: user.middle_name ?? null,
    lastName: user.last_name,
    mobileNumber: user.mobile_number,
    userId: binaryToUuid(user.id),
    email: user.email,
    userTypeId: binaryToUuid(user.role_id),
    userType: user.role?.name || 'Unknown'
  };
}

export function toStudentResponse(item: any ): StudentListResponse {
  return {
    studentId: binaryToUuid(item.student_id || item.id),
    firstName: item.first_name,
    middleName: item.middle_name || undefined,
    lastName: item.last_name,
    extensionName: item.extension_name || undefined,
    sex: item.sex,
    placeOfBirth: item.place_of_birth,
    birthdate: new Date(item.birthdate),
    height: item.height || undefined,
    weight: item.weight || undefined,
    permanentStreet: item.permanent_street,
    permanentBrgyId: item.permanent_brg_id,
    permanentBrgyName: item.permanent_barangay?.brgy_desc,
    permanentBrgyCode: item.permanent_barangay?.brgy_code,
    permanentCitymunId: item.permanent_citymun_id,
    permanentCitymunName: item.permanent_citynum?.citymun_desc,
    permanentCitymunCode: item.permanent_citynum?.citymun_code,
    permanentProvinceId: item.permanent_province_id,
    permanentProvinceName: item.permanent_province?.prov_desc,
    permanentProvinceCode: item.permanent_province?.prov_code,
    permanentRegionId: item.permanent_region_id,
    permanentRegionName: item.permanent_region?.region_desc,
    permanentRegionCode: item.permanent_region?.region_code,
    permanentZipCode: item.permanent_zip_code,
    permanentCountry: item.permanent_country,
    currentStreet: item.current_street,
    currentBrgyId: item.current_brg_id,
    currentBrgyName: item.current_barangay?.brgy_desc,
    currentBrgyCode: item.current_barangay?.brgy_code,
    currentCitymunId: item.current_citymun_id,
    currentCitymunName: item.current_citymun?.citymun_desc,
    currentCitymunCode: item.current_citymun?.citymun_code,
    currentProvinceId: item.current_province_id,
    currentProvinceName: item.current_province?.prov_desc,
    currentProvinceCode: item.current_province?.prov_code,
    currentRegionId: item.current_region_id,
    currentRegionName: item.current_region?.region_desc,
    currentRegionCode: item.current_region?.region_code,
    currentZipCode: item.current_zip_code,
    currentCountry: item.current_country,
    email: item.email,
    mobileNumber: item.mobile_number,
    isSoloParent: item.is_solo_parent,
    isChildOfSoloParent: item.is_child_of_solo_parent,
    isIndigenousPeople: item.is_indigenous_people,
    indigenousGroup: item.indigenous_group || undefined,
    isSped: item.is_sped,
    isPwd: item.is_pwd,
    emergencyContactName: item.emergency_contact_name,
    emergencyContactNumber: item.emergency_contact_number,
    emergencyContactName2: item.emergency_contact_name2,
    emergencyContactNumber2: item.emergency_contact_number2,
    g12AcademicStrand: item.g12_academic_strand,
    g12ProgramName: item.g12_program_name,
    g12AwardHonor: item.g12_award_honor,
    g12Organization: item.g12_organization,
    g12YearOfGraduation: item.g12_year_of_graduation,
    g12SchoolId: item.g12_school_id ?  binaryToUuid(item.g12_school_id) : item.g12_school_id,
    g12SchoolName: item.g12_school?.school_name,
    collegeProgramName: item.college_program_name,
    collegeYearLevel: item.college_year_level,
    collegeAwardHonor: item.college_award_honor,
    collegeOrganization: item.college_organization,
    collegeSchoolId: item.college_school_id ? binaryToUuid(item.college_school_id) : item.college_school_id,
    collegeSchoolName: item.college_school?.school_name,
    fatherLastName: item.father_last_name,
    fatherFirstName: item.father_first_name,
    fatherMiddleName: item.father_middle_name || undefined,
    fatherExtension: item.father_extension || undefined,
    fatherOccupation: item.father_occupation,
    fatherIncome: item.father_income || undefined,
    fatherMobileNumber: item.father_mobile_number,
    motherMaidenLastName: item.mother_maiden_last_name,
    motherMaidenFirstName: item.mother_maiden_first_name,
    motherMaidenMiddleName: item.mother_maiden_middle_name || undefined,
    motherMaidenExtension: item.mother_maiden_extension || undefined,
    motherOccupation: item.mother_occupation,
    motherIncome: item.mother_income || undefined,
    motherMobileNumber: item.mother_mobile_number,
    guardianLastName: item.guardian_last_name,
    guardianFirstName: item.guardian_first_name,
    guardianMiddleName: item.guardian_middle_name || undefined,
    guardianExtension: item.guardian_extension || undefined,
    guardianOccupation: item.guardian_occupation,
    guardianIncome: item.guardian_income || undefined,
    guardianMobileNumber: item.guardian_mobile_number,
    numberOfSiblings: item.number_of_siblings,
    siblings: item.siblings?.map((sibling: any) => ({
      studentId: binaryToUuid(sibling.student_id),
      siblingName: sibling.sibling_name,
      siblingBdate: new Date(sibling.sibling_bdate),
      siblingAge: sibling.sibling_age,
      siblingStatus: sibling.sibling_status,
      livingWithParents: sibling.living_with_parents,
      ownHouse: sibling.own_house,
    })) || [],
  }
}

export function toUserPermissionResponse(permissions: any[]): any[] {
  if (!Array.isArray(permissions)) {
    console.error("Invalid permissions data:", permissions); // Debugging output
    return [];
  }

  return permissions.map(permission => ({
    moduleId: binaryToUuid(permission.module_id), 
    moduleName: permission.module?.name,
    roleId: binaryToUuid(permission.role_id),
    roleName: permission.role?.name,
    show: permission.show ?? false,
    save: permission.save ?? false,
    delete: permission.delete ?? false,
  }));
}



export function toAddressResponse(data: any[]): AddressResponse[] {
  return data.map((item) => ({
    psgcCode: item.psgc_code,
    regDesc: item.reg_desc,
    regCode: item.reg_code,
    provDesc: item.prov_desc,
    provCode: item.prov_code,
    citymunDesc: item.citymun_desc,
    citymunCode: item.citymun_code,
    brgyCode: item.brgy_code,
    brgyDesc: item.brgy_desc,
  }));
}

export function toRolesResponse(data: any[]): RoleResponse[] {
  return data.map((item) => ({
    id: binaryToUuid(item.id),
    name: item.name,
    description: item.description
  }));
}

export function toSchoolResponse(data: any): any {
  console.log("Data here", data);
  return {
    id: binaryToUuid(data.id),
    name: data.school_name,
    provinceId: data.province_id,
    provinceName: data.province.prov_desc,
    cityMunId: data.citymun_id,
    cityMunName: data.citymun.citymun_desc,
    brgyId: data.brgy_id,
    brgyName: data.brgy.brgy_desc,
    schoolType: data.school_type
  };
}

export function toSchoolModel( school: SchoolPayload): Prisma.schoolUncheckedCreateInput {
  return {
    school_name: school.name,
    school_type: school.schoolType,
    citymun_id: school.cityMunId,
    province_id: school.provinceId,
    brgy_id: school.brgyId
  }
}

export function toAcadyearModel( academicYear: AcademicYearRequest,userId: string): Prisma.academicYearUncheckedCreateInput {
  return {
    academic_year_start: academicYear.academicYearStart,
    academic_year_end: academicYear.academicYearEnd,
    school_term: academicYear.schoolTerm,
    date_from: academicYear.dateFrom,
    date_to: academicYear.dateTo,
    updated_at:  new Date,
    created_by: uuidToBinary(userId),
    updated_by: uuidToBinary(userId),
  }
}

export function toAcadyearResponse( data: academicYear ): AcademicYearResponse {
  return {
    id: binaryToUuid( data.id),
    academicYearStart: data.academic_year_start,
    academicYearEnd: data.academic_year_end,
    schoolTerm: data.school_term,
    dateFrom: data.date_from.toISOString(),
    dateTo: data.date_to.toISOString()
  }
}