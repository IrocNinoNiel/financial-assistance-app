import { RecordStatus, StudentRequest } from "../utils";
import { Sibling, Student } from "./model";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerStudentRepo = async ( student: Student ) : Promise<any> => {

    try {
        // const newStudent = await prisma.students.create({
        //     data: student,
        // });
        
        return "";

    } catch (error) {
        console.error('Error registration: ', error);
        throw new Error('Database error: '+ error.message);
    }
}

export const registerSiblingsRepo = async (siblings: Sibling[]): Promise<void> => {
    try {
        await prisma.siblings.createMany({
            data: siblings
        });
    } catch (error) {
        console.error('Error registration: ', error);
        throw new Error('Database error: ' + error.message);
    }
}

export const checkStudentEmailExists = async (email: string) : Promise<boolean>  => {
  try {
    const user = await prisma.students.findFirst({
      where: {
        email: email,
        recordStatus: RecordStatus.ACTIVE
      },
    });

    return user !== null;
  } catch (error) {
    console.error('Error checking email existence:', error);
    throw new Error('Database error');
  }
}

export const getAllStudentRepo = async () : Promise<any> => {
  try {
    const users = await prisma.students.findMany({
      where: {
        recordStatus: RecordStatus.ACTIVE
      },
      include: {
        siblings:true
      }
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Database error');
  }
}
