import { PrismaClient } from '@prisma/client';
import { GetAllUsersParams, uuidToBinary } from '../utils';

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
            role: {
              select: {
                name: true
              },
            },
        },
      });
  
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Database error');
    }
};

export const doesUserExistRepo = async (userId: string): Promise<boolean> => {
  const data = await prisma.user.findUnique({
      where: { id: uuidToBinary(userId) }, 
    });
    return !!data;
};
