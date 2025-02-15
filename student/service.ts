import { extractUserFromToken, StudentRequest, uuidToBinary } from "../utils";
import { v4 as uuidv4 } from 'uuid';
import { convertStudentResponseToStudent, convertToSiblingData, convertToStudentResponse } from "../utils/converter";
import { checkStudentRepo, getAllStudentRepo, isEmailTakenByAnotherStudentRepo, registerSiblingsRepo, registerStudentRepo, updateSiblingsRepo, updateStudentRepo } from "./repository";
import { Prisma, students } from "@prisma/client";


export const registerStudentService = async ( data: StudentRequest, authHeader: any ) => {

    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    const studentId = uuidToBinary(uuidv4());
    
    const studentData: Prisma.studentsUncheckedCreateInput = convertStudentResponseToStudent(data, userId, studentId);
    console.log("Student data to be saved", studentData);
    const student: students = await registerStudentRepo(studentData);

    const siblingData: Prisma.siblingsUncheckedCreateInput[] = convertToSiblingData(studentId, student.id, data.siblings);
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
    
    const studentData: Prisma.studentsUncheckedCreateInput = convertStudentResponseToStudent(data, userId, convertedId);
    const student: students = await updateStudentRepo(studentData, convertedId);
    console.log("Student data has been updated", studentData);

    const siblingData: Prisma.siblingsUncheckedCreateInput[] = convertToSiblingData(convertedId, student.id, data.siblings);
    await updateSiblingsRepo(student.id, siblingData)
    console.log("Student sibling has been saved", siblingData);

    const convertedResult = convertToStudentResponse(student, siblingData);
    console.log("Student Data Successfully updated",convertedResult);
    return convertedResult;
}

export const getAllStudent = async () => {
    const data = await getAllStudentRepo();
    return data;
}

export const checkStudent = async (roleId: number) => {
    return await checkStudentRepo(roleId);   
}

export const isEmailTakenByAnotherStudent = async ( email: string, studentId: string): Promise<boolean> => {
    return await isEmailTakenByAnotherStudentRepo(email, studentId)
}