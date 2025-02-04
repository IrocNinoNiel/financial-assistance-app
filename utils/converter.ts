import { User } from "../authentication/model";
import { Sibling, Student } from "../student/model";
import { RegisterRequest, SiblingRequest, StudentRequest, UserListResponse, UserResponse } from "./types";
import { binaryToUuid, uuidToBinary } from "./utils";

export function toUserResponse(user: any,): UserResponse { 

    return {
        user_id: binaryToUuid(user.user_id),
        email: user.email
    }
}

export function convertStudentRequestToStudent(
  request: StudentRequest,
  userId: number,
  studentId: Buffer,
  applicationFormData: string
): Student {
  
  // Handle school type case conversion
  const schoolType =  request.education.grade12.privateOrPublic.charAt(0).toUpperCase() + request.education.grade12.privateOrPublic.slice(1).toLowerCase() as "Private" | "Public";
  const currentSchoolType = request.education.college.privateOrPublic.charAt(0).toUpperCase() + request.education.college.privateOrPublic.slice(1).toLowerCase() as "Private" | "Public";

  return {
    student_id: studentId,
    user_id: userId, 
    first_name: request.name.firstName,
    middle_name: request.name.middleName,
    last_name: request.name.lastName,
    extension_name: request.name.extension,
    sex: request.sex,
    place_of_birth: request.placeOfBirth,
    birthdate: new Date(request.birthdate),
    height: request.height,
    weight: request.weight,
    permanent_address: request.address.permanent,
    current_address: request.address.current,
    email: request.email,
    mobile_number: request.mobileNumber,
    is_solo_parent: request.soloParent,
    is_child_of_solo_parent: request.childOfSoloParent,
    is_indigenous_people: request.indigenous.isMember,
    indigenous_group: request.indigenous.group,
    is_sped: request.spEd,
    is_pwd: request.pwd,
    emergency_contact_name: request.emergencyContact.fullName,
    emergency_contact_number: request.emergencyContact.mobileNumber,
    academic_strand: request.education.grade12.strand,
    program_name: request.education.college?.programName || '',
    award_honor: request.education.college?.awardHonor,
    organization: request.education.college?.organization,
    school_name: request.education.grade12.schoolName,
    school_address: request.education.grade12.schoolAddress,
    school_type: schoolType,
    year_of_graduation: request.education.grade12.yearOfGraduation,
    current_program_name: request.education.college?.programName || '',
    current_year_level: request.education.college?.yearLevel || 0,
    current_award_honor: request.education.college?.awardHonor,
    current_organization: request.education.college?.organization,
    current_school_name: request.education.college?.schoolName || '',
    current_school_address: request.education.college?.schoolAddress || '',
    current_school_type: currentSchoolType,
    father_last_name: request.family.father.lastName,
    father_first_name: request.family.father.firstName,
    father_middle_name: request.family.father.middleName,
    father_extension: request.family.father.extension,
    father_occupation: request.family.father.occupation,
    father_income: request.family.father.income,
    father_mobile_number: request.family.father.mobileNumber,
    mother_maiden_last_name: request.family.mother.lastName,
    mother_maiden_first_name: request.family.mother.firstName,
    mother_maiden_middle_name: request.family.mother.middleName,
    mother_maiden_extension: request.family.mother.extension,
    mother_occupation: request.family.mother.occupation,
    mother_income: request.family.mother.income,
    mother_mobile_number: request.family.mother.mobileNumber,
    guardian_last_name: request.family.guardian.lastName,
    guardian_first_name: request.family.guardian.firstName,
    guardian_middle_name: request.family.guardian.middleName,
    guardian_extension: request.family.guardian.extension,
    guardian_occupation: request.family.guardian.occupation,
    guardian_income: request.family.guardian.income,
    guardian_mobile_number: request.family.guardian.mobileNumber,
    number_of_siblings: request.family.siblings.length,
    emergency_contact_name2: request.family.emergencyContact.fullName,
    emergency_contact_number2: request.family.emergencyContact.mobileNumber,
    applicationForm: applicationFormData,
    created_by: studentId,
    updated_by: studentId
  };
}

export function convertToStudentResponse(student: any, siblings: Sibling[]) {
  const { id, user_id, created_at, created_by, updated_at, updated_by, ...result } = student;

  result.student_id = binaryToUuid(result.student_id);
  result.siblings = siblings.map(({ student_id, created_by, updated_by, ...sibling }) => sibling);

  return result;
}

export function convertToSiblingData(studentBufferId: Buffer, studentInternalId: number,  siblingRequests: SiblingRequest[]): Sibling[] {
  return siblingRequests.map(sibling => ({
      student_id: studentInternalId,
      sibling_name: sibling.name,
      sibling_bdate: new Date(sibling.birthdate),
      sibling_age: sibling.age,
      living_with_parents: sibling.livingWithParents,
      sibling_status: sibling.status as "Single" | "Married" | "Divorced" | "Widowed",
      own_house: sibling.ownHouse,
      created_by: studentBufferId,
      updated_by: studentBufferId
  }));
}

export function convertToUser(data: RegisterRequest, hashedPassword: any, userId: string): User {
   return {
      email: data.username,
      password: hashedPassword,
      user_id: uuidToBinary(userId),
      last_name:  data.name.lastName,
      first_name: data.name.firstName,
      middle_name: data.name.middleName,
      mobile_number: data.mobileNumber
  }
}

export function toUserListResponse(data: any): UserListResponse[] {
  return data.map((user) => ({
    first_name: user.first_name,
    middle_name: user.middle_name ?? null,
    last_name: user.last_name,
    mobile_number: user.mobile_number,
    user_id: binaryToUuid(user.user_id),
    email: user.email,
    user_type: user.role_user[0]?.roles?.name || 'Unknown' // Handle cases with missing role_user
  }));
}