import { PrismaClient } from '@prisma/client';
import { GetAllUsersParams } from '../utils';

const prisma = new PrismaClient();

export const isAdminRepo = async (userId: number) : Promise<boolean> => {
    try {
        const userRole = await prisma.role_user.findFirst({
            where: {
              user_id: userId,
            },
            include: {
              roles: {
                select: {
                  name: true,
                },
              },
            },
        });
          
    
        return userRole?.roles?.name.toLowerCase() === "system admin";
    } catch (error) {
        console.error('Error registration: ', error);
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
            user_id: true,
            email: true,
            role_user: {
                select: {
                roles: {
                    select: {
                        name: true
                    },
                },
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