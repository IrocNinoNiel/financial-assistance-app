import { extractUserFromToken, StudentRequest, uuidToBinary } from "../utils";
import { v4 as uuidv4 } from 'uuid';
import { convertStudentRequestToStudent, convertToSiblingData, convertToStudentResponse } from "../utils/converter";
import { registerSiblingsRepo, registerStudentRepo } from "./repository";
import { Sibling } from "./model";

export const registerStudentService = async ( data: StudentRequest, authHeader: any ) => {

    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    const studentId = uuidToBinary(uuidv4());
    
    const studentData: any = convertStudentRequestToStudent(data, userId, studentId, "");
    console.log("Student data to be saved", studentData);
    const student: any = await registerStudentRepo(studentData);

    const siblingData: Sibling[] = convertToSiblingData(studentId, student.id, data.family.siblings);
    console.log("Student sibling data to be saved", siblingData);
    await registerSiblingsRepo(siblingData)

    const convertedResult = convertToStudentResponse(student, siblingData);
    console.log("Student Data Successfully created",convertedResult);
    return convertedResult;
}