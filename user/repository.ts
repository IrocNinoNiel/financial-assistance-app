import { Prisma, PrismaClient, user } from '@prisma/client';
import { GetAllUsersParams, PartialStudentUser, RecordStatus, uuidToBinary } from '../utils';

const prisma = new PrismaClient();

export const isAdminRepo = async (userId: string) : Promise<boolean> => {
  try {
    const isSystemAdmin = await prisma.user.findFirst({
      where: {
        id: uuidToBinary(userId),
        role: {
          name: 'System Admin',
        },
      },
    });

    return isSystemAdmin !== null;
  } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Database error');
  }
}

export const getAllUsersRepo = async () => {
    try {
      const users = await prisma.user.findMany({
        select: {
            first_name: true,
            middle_name: true,
            last_name: true,
            mobile_number: true,
            id: true,
            email: true,
            role_id: true,
            role: {
              select: {
                name: true
              },
            },
        },
        where: {
          record_status: RecordStatus.ACTIVE
        }
      });
  
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Database error');
    }
};

export const doesUserExistRepo = async (userId: string): Promise<boolean> => {
  try {
    const data = await prisma.user.findUnique({
      where: { id: uuidToBinary(userId), record_status: RecordStatus.ACTIVE }, 
    });
  return !!data;
  } catch (error) {
    console.error('Error doesUserExistRepo:', error);
    throw new Error('Database error');
  }
};

export const partialUpdateUserRepo = async ( userData: PartialStudentUser, userId: string): Promise<void> => {
  try {
    
    const updateUser = await prisma.user.update({
      where: { id: uuidToBinary(userId) },
      data: userData
    });

    console.log("User partially updated successfully", updateUser);

  } catch (error) {
    console.error("Error updating student: ", error);
    throw new Error("Database error: " + error.message);
  }
}

export const getOneUserRepo = async (userId: string): Promise<user> => {
  try{
    const data: user = await prisma.user.findFirst({
      where: { id: uuidToBinary(userId), record_status: RecordStatus.ACTIVE }, 
      include: {
        role: {
           select: { name: true }  
        }, 
      }
    });
    return data;
  } catch (error) {
    console.error('Error getOneUserRepo:', error);
    throw new Error('Database error');
  }
    
};

export const updateUserRepo = async ( data: user, userId: string ) => {
  try {
    await prisma.user.update({
      where: { id: uuidToBinary(userId) },
      data,
    });
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

export const deleteUserRepo = async ( userId: string ) => {
  try {
    await prisma.user.update({
      where: { id: uuidToBinary(userId) },
      data: {record_status: RecordStatus.DELETED},
    });
  } catch (error) {
    console.error('Error updating user:', error);
  }
}