import { PrismaClient } from '@prisma/client';
import { GetAllUsersParams } from '../utils';

const prisma = new PrismaClient();

export const isAdminRepo = async (userId: number) : Promise<boolean> => {
  try {
    const isSystemAdmin = await prisma.user.findFirst({
      where: {
        id: userId,
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
        where: {
          role_id: { not: 2 }
        },
        select: {
            first_name: true,
            middle_name: true,
            last_name: true,
            mobile_number: true,
            user_id: true,
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