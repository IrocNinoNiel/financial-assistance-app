import { extractUserFromToken, StudentRequest, uuidToBinary } from "../utils";
import { v4 as uuidv4 } from 'uuid';
import { convertStudentResponseToStudent, convertToSiblingData, convertToStudentResponse } from "../utils/converter";
import { getAllStudentRepo, registerSiblingsRepo, registerStudentRepo } from "./repository";
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

export const getAllStudent = async () => {
    const data = await getAllStudentRepo();
    return data;
}