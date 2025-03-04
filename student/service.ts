import { binaryToUuid, extractUserFromToken, PartialStudentUser, StudentListResponse, StudentRequest, uuidToBinary } from "../utils";
import { v4 as uuidv4 } from 'uuid';
import { convertStudentResponseToStudent, convertToSiblingData, convertToStudentResponse, convertToStudentUser, toStudentResponse } from "../utils/converter";
import { checkIfStudentRepo, doesStudentExistRepo, getAllStudentRepo, getOneStudentRepo, isEmailTakenByAnotherStudentRepo, registerSiblingsRepo, registerStudentRepo, updateSiblingsRepo, updateStudentRepo } from "./repository";
import { Prisma, student } from "@prisma/client";
import { partialUpdateUserRepo } from "../user/repository";


export const registerStudentService = async ( data: StudentRequest, authHeader: any ) => {

    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
   
    const studentData: Prisma.studentUncheckedCreateInput = convertStudentResponseToStudent(data, userId);
    console.log("Student data to be saved", studentData);
    const student: student = await registerStudentRepo(studentData);

    const siblingData: Prisma.siblingUncheckedCreateInput[] = convertToSiblingData(binaryToUuid(student.id), data.siblings);
    console.log("Student sibling data to be saved", siblingData);
    await registerSiblingsRepo(siblingData)

    const convertedResult = convertToStudentResponse(student, siblingData);
    console.log("Student Data Successfully created",convertedResult);
    return convertedResult;
}

export const updateStudentService = async ( data: StudentRequest, authHeader: any, studentId: string ) => {

    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    const convertedId = uuidToBinary(studentId);

    const studentData: Prisma.studentUncheckedCreateInput = convertStudentResponseToStudent(data, userId);
    const student: student = await updateStudentRepo(studentData, convertedId);
    console.log("Student data has been updated", studentData);

    const userData: PartialStudentUser = convertToStudentUser( data );
    await partialUpdateUserRepo( userData, userId);

    const siblingData: Prisma.siblingUncheckedCreateInput[] = convertToSiblingData(binaryToUuid(student.id), data.siblings);
    await updateSiblingsRepo(binaryToUuid(student.id), siblingData)
    console.log("Student sibling has been saved", siblingData);

    const convertedResult = convertToStudentResponse(student, siblingData);
    console.log("Student Data Successfully get",convertedResult);
    return convertedResult;
}

export const getAllStudent = async () => {
    const data = await getAllStudentRepo();
    const converted: StudentListResponse[] = data.map(item => toStudentResponse(item));
    return converted;
}

export const getOneStudent = async ( userId: string ) => {
    const data = await getOneStudentRepo( userId );

    console.log("get one student", data);
    if(data === null) {
        return null;
    }

    const converted = toStudentResponse( data );
    return converted;
}

export const checkStudent = async (roleId: string): Promise<boolean> => {
    return await checkIfStudentRepo(roleId);   
}

export const isEmailTakenByAnotherStudent = async ( email: string, studentId: string): Promise<boolean> => {
    return await isEmailTakenByAnotherStudentRepo(email, studentId)
}

export const doesStudentExist = async ( studentId: string ): Promise<boolean> => {
    return await doesStudentExistRepo(studentId);
}