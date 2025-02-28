import { binaryToUuid, RecordStatus, uuidToBinary } from "../utils";
import { Prisma, PrismaClient, students, user } from '@prisma/client';

const prisma = new PrismaClient({  });

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
      where: { id: studentId },
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
  studentId: string,
  siblings: Prisma.siblingsUncheckedCreateInput[]
): Promise<void> => {
  try {
    await prisma.$transaction([
      // Delete all existing siblings linked to the student
      prisma.siblings.deleteMany({
        where: { student_id: uuidToBinary(studentId) }
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

export const getOneStudentRepo = async ( userId: string) : Promise<any> => {
  try {
    const user = await prisma.students.findFirst({
      where: {
        record_status: RecordStatus.ACTIVE,
        user_id: uuidToBinary(userId)
      },
      include: {
        siblings:true
      }
    });

    return user;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Database error');
  }
}

export const checkIfStudentRepo = async (userId: string): Promise<boolean> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: uuidToBinary(userId),
        record_status: RecordStatus.ACTIVE
      },
      select: {
        role: {
          select: {
            id: true,
            name: true,
            record_status: true
          }
        }
      }
    });

    if (!user || !user.role || user.role.record_status !== RecordStatus.ACTIVE) {
      return false;
    }

    console.log("user", userId, {id: binaryToUuid(user.role.id), role_name: user.role.name});

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
        id: { not: uuidToBinary(studentId) },
      },
    });

    return !!existingUser;
  } catch (error) {
    console.error('Error checking email existence:', error);
    throw new Error('Database error');
  }
};

export const doesStudentExistRepo = async (studentId: string): Promise<boolean> => {
  const student = await prisma.students.findUnique({
    where: { id: uuidToBinary(studentId) }, 
  });
  return !!student;
}