
import { Prisma } from "@prisma/client";
import { User } from "../authentication/model";
import { AddressResponse, RegisterRequest, RoleResponse, SchoolResponse, SiblingRequest, StudentListResponse, StudentRequest, UserListResponse, UserResponse } from "./types";
import { binaryToUuid, uuidToBinary } from "./utils";

export function toUserResponse(user: any,): UserResponse { 

    return {
        user_id: binaryToUuid(user.user_id),
        email: user.email
    }
}

export function convertStudentResponseToStudent(response: StudentRequest, userId: string): Prisma.studentsUncheckedCreateInput  {
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

export function convertToStudentResponse(student: any, siblings: Prisma.siblingsUncheckedCreateInput[]) {
  const { user_id, created_at, created_by, updated_at, updated_by, ...result } = student;

  result.id = binaryToUuid(result.id);
  result.g12_school_id = binaryToUuid(result.g12_school_id);
  result.college_school_id = binaryToUuid(result.college_school_id);
  result.siblings = siblings.map(({ student_id, created_by, updated_by, ...sibling }) => sibling);

  return result;
}

export function convertToSiblingData(studentId: string,  siblingRequests: SiblingRequest[]): Prisma.siblingsUncheckedCreateInput[] {
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

export function toUserListResponse(data: any): UserListResponse[] {
  return data.map((user) => ({
    first_name: user.first_name,
    middle_name: user.middle_name ?? null,
    last_name: user.last_name,
    mobile_number: user.mobile_number,
    user_id: binaryToUuid(user.id),
    email: user.email,
    user_type: user.role?.name || 'Unknown' // Handle cases with missing role_user
  }));
}

export function toStudentResponse(data: any): StudentListResponse[] {
  return data.map((item: any) => ({
    student_id: binaryToUuid(item.student_id),
    first_name: item.first_name,
    middle_name: item.middle_name || undefined,
    last_name: item.last_name,
    extension_name: item.extension_name || undefined,
    sex: item.sex,
    place_of_birth: item.place_of_birth,
    birthdate: new Date(item.birthdate),
    height: item.height || undefined,
    weight: item.weight || undefined,
    permanent_address: item.permanent_address,
    current_address: item.current_address,
    email: item.email,
    mobile_number: item.mobile_number,
    is_solo_parent: item.is_solo_parent,
    is_child_of_solo_parent: item.is_child_of_solo_parent,
    is_indigenous_people: item.is_indigenous_people,
    indigenous_group: item.indigenous_group || undefined,
    is_sped: item.is_sped,
    is_pwd: item.is_pwd,
    emergency_contact_name: item.emergency_contact_name,
    emergency_contact_number: item.emergency_contact_number,
    academic_strand: item.academic_strand,
    program_name: item.program_name,
    award_honor: item.award_honor || undefined,
    organization: item.organization || undefined,
    school_name: item.school_name,
    school_address: item.school_address,
    school_type: item.school_type,
    year_of_graduation: item.year_of_graduation,
    current_program_name: item.current_program_name,
    current_year_level: item.current_year_level,
    current_award_honor: item.current_award_honor || undefined,
    current_organization: item.current_organization || undefined,
    current_school_name: item.current_school_name,
    current_school_address: item.current_school_address,
    current_school_type: item.current_school_type,
    father_last_name: item.father_last_name,
    father_first_name: item.father_first_name,
    father_middle_name: item.father_middle_name || undefined,
    father_extension: item.father_extension || undefined,
    father_occupation: item.father_occupation,
    father_income: item.father_income || undefined,
    father_mobile_number: item.father_mobile_number,
    mother_maiden_last_name: item.mother_maiden_last_name,
    mother_maiden_first_name: item.mother_maiden_first_name,
    mother_maiden_middle_name: item.mother_maiden_middle_name || undefined,
    mother_maiden_extension: item.mother_maiden_extension || undefined,
    mother_occupation: item.mother_occupation,
    mother_income: item.mother_income || undefined,
    mother_mobile_number: item.mother_mobile_number,
    guardian_last_name: item.guardian_last_name,
    guardian_first_name: item.guardian_first_name,
    guardian_middle_name: item.guardian_middle_name || undefined,
    guardian_extension: item.guardian_extension || undefined,
    guardian_occupation: item.guardian_occupation,
    guardian_income: item.guardian_income || undefined,
    guardian_mobile_number: item.guardian_mobile_number,
    number_of_siblings: item.number_of_siblings,
    emergency_contact_name2: item.emergency_contact_name2,
    emergency_contact_number2: item.emergency_contact_number2,
    application_form: item.application_form,
    siblings: item.siblings?.map((sibling: any) => ({
      student_id: binaryToUuid(sibling.student_id),
      sibling_name: sibling.sibling_name,
      sibling_bdate: new Date(sibling.sibling_bdate),
      sibling_age: sibling.sibling_age,
      sibling_status: sibling.sibling_status,
      living_with_parents: sibling.living_with_parents,
      own_house: sibling.own_house,
    })) || [],
  }));
}

export function toOneStudentResponse(item: any): StudentListResponse{
  return {
    student_id: binaryToUuid(item.id),
    first_name: item.first_name,
    middle_name: item.middle_name || undefined,
    last_name: item.last_name,
    extension_name: item.extension_name || undefined,
    sex: item.sex,
    place_of_birth: item.place_of_birth,
    birthdate: new Date(item.birthdate),
    height: item.height || undefined,
    weight: item.weight || undefined,
    permanent_address: item.permanent_address,
    current_address: item.current_address,
    email: item.email,
    mobile_number: item.mobile_number,
    is_solo_parent: item.is_solo_parent,
    is_child_of_solo_parent: item.is_child_of_solo_parent,
    is_indigenous_people: item.is_indigenous_people,
    indigenous_group: item.indigenous_group || undefined,
    is_sped: item.is_sped,
    is_pwd: item.is_pwd,
    emergency_contact_name: item.emergency_contact_name,
    emergency_contact_number: item.emergency_contact_number,
    academic_strand: item.academic_strand,
    program_name: item.program_name,
    award_honor: item.award_honor || undefined,
    organization: item.organization || undefined,
    school_name: item.school_name,
    school_address: item.school_address,
    school_type: item.school_type,
    year_of_graduation: item.year_of_graduation,
    current_program_name: item.current_program_name,
    current_year_level: item.current_year_level,
    current_award_honor: item.current_award_honor || undefined,
    current_organization: item.current_organization || undefined,
    current_school_name: item.current_school_name,
    current_school_address: item.current_school_address,
    current_school_type: item.current_school_type,
    father_last_name: item.father_last_name,
    father_first_name: item.father_first_name,
    father_middle_name: item.father_middle_name || undefined,
    father_extension: item.father_extension || undefined,
    father_occupation: item.father_occupation,
    father_income: item.father_income || undefined,
    father_mobile_number: item.father_mobile_number,
    mother_maiden_last_name: item.mother_maiden_last_name,
    mother_maiden_first_name: item.mother_maiden_first_name,
    mother_maiden_middle_name: item.mother_maiden_middle_name || undefined,
    mother_maiden_extension: item.mother_maiden_extension || undefined,
    mother_occupation: item.mother_occupation,
    mother_income: item.mother_income || undefined,
    mother_mobile_number: item.mother_mobile_number,
    guardian_last_name: item.guardian_last_name,
    guardian_first_name: item.guardian_first_name,
    guardian_middle_name: item.guardian_middle_name || undefined,
    guardian_extension: item.guardian_extension || undefined,
    guardian_occupation: item.guardian_occupation,
    guardian_income: item.guardian_income || undefined,
    guardian_mobile_number: item.guardian_mobile_number,
    number_of_siblings: item.number_of_siblings,
    emergency_contact_name2: item.emergency_contact_name2,
    emergency_contact_number2: item.emergency_contact_number2,
    application_form: item.application_form,
    siblings: item.siblings?.map((sibling: any) => ({
      student_id: binaryToUuid(sibling.student_id),
      sibling_name: sibling.sibling_name,
      sibling_bdate: new Date(sibling.sibling_bdate),
      sibling_age: sibling.sibling_age,
      sibling_status: sibling.sibling_status,
      living_with_parents: sibling.living_with_parents,
      own_house: sibling.own_house,
    })) || [],
  };
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

export function toSchoolResponse(data: any[]): SchoolResponse[] {
  return data.map((item) => ({
    id: binaryToUuid(item.id),
    name: item.school_name
  }));
}