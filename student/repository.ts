import { RecordStatus, uuidToBinary } from "../utils";
import { Prisma, PrismaClient, students } from '@prisma/client';

const prisma = new PrismaClient();

export const registerStudentRepo = async ( student: Prisma.studentsUncheckedCreateInput ) : Promise<students> => {

    try {
        const newStudent = await prisma.students.create({
            data: student
        });
        
        return newStudent;

    } catch (error) {
        console.error('Error registration: ', error);
        throw new Error('Database error: '+ error.message);
    }
}

export const updateStudentRepo = async (
  studentData: Prisma.studentsUncheckedUpdateInput,
  studentId: Buffer,
): Promise<students> => {
  try {
    const updatedStudent = await prisma.students.update({
      where: { student_id: studentId },
      data: studentData
    });

    return updatedStudent;
  } catch (error) {
    console.error("Error updating student: ", error);
    throw new Error("Database error: " + error.message);
  }
};


export const registerSiblingsRepo = async (siblings: Prisma.siblingsUncheckedCreateInput[]): Promise<void> => {
    try {
        await prisma.siblings.createMany({
            data: siblings
        });
    } catch (error) {
        console.error('Error registration: ', error);
        throw new Error('Database error: ' + error.message);
    }
}

export const updateSiblingsRepo = async (
  studentId: number,
  siblings: Prisma.siblingsUncheckedCreateInput[]
): Promise<void> => {
  try {
    await prisma.$transaction([
      // Delete all existing siblings linked to the student
      prisma.siblings.deleteMany({
        where: { student_id: studentId }
      }),

      prisma.siblings.createMany({
            data: siblings
      })
    ]);

    console.log("Sibling data updated successfully.");
  } catch (error) {
    console.error("Error updating siblings: ", error);
    throw new Error("Database error: " + error.message);
  }
};


export const checkStudentEmailExists = async (email: string) : Promise<boolean>  => {
  try {
    const user = await prisma.students.findFirst({
      where: {
        email: email,
        record_status: RecordStatus.ACTIVE
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
        record_status: RecordStatus.ACTIVE
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

export const checkStudentRepo = async (userId: number): Promise<boolean> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        role: {
          select: {
            name: true,
            record_status: true
          }
        }
      }
    });

    if (!user || !user.role || user.role.record_status !== RecordStatus.ACTIVE) {
      return false;
    }

    return user.role.name.toLowerCase() === "student";
  } catch (error) {
    console.error('Error checking role existence:', error);
    throw new Error('Database error');
  }
};

export const isEmailTakenByAnotherStudentRepo = async (email: string, studentId: string): Promise<boolean> => {
  try {
    const existingUser = await prisma.students.findFirst({
      where: {
        email,
        student_id: { not: uuidToBinary(studentId) },
      },
    });

    return !!existingUser;
  } catch (error) {
    console.error('Error checking email existence:', error);
    throw new Error('Database error');
  }
};