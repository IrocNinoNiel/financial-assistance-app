import { PrismaClient } from '@prisma/client';
import { RecordStatus } from '../utils';
import { User, UserRole } from './model';

const prisma = new PrismaClient();

export const checkEmailExists = async (email: string) : Promise<boolean>  => {
  try {
    const user = await prisma.user.findFirst({
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

export const checkUserExists = async (email: string) : Promise<any>  => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: email,
          recordStatus: RecordStatus.ACTIVE
        },
      });
  
      return user;
    } catch (error) {
      console.error('Error checking email existence:', error);
      throw new Error('Database error');
    }
}

export const getRoleRepo = async (name: string) : Promise<any>  => {
  try {
    const user = await prisma.roles.findFirst({
      where: {
        name: name,
        recordStatus: RecordStatus.ACTIVE
      },
    });

    return user;
  } catch (error) {
    console.error('Error checking role existence:', error);
    throw new Error('Database error');
  }
}

export const registerRepo = async (user: User) : Promise<any> => {
    try {
        const newUser = await prisma.user.create({
            data: user,
        });
    
        return newUser;
    } catch (error) {
        console.error('Error registration: ', error);
        throw new Error('Database error');
    }
}

export const getPermission = async (roleId: number) : Promise<any> => {
  try {
    const permission = await prisma.modulePermission.findMany({
      where: {
        role_id: roleId,
      },
      select: {
        module_id: true,
        module: {
          select: {
            name: true
          }
        },
        role_id: true,
        role: {
          select: {
            name: true
          }
        },
        show: true,
        edit: true,
        save: true,
        delete: true
      },
    });

    return permission;
  } catch (error) {
    console.error('Error checking role existence:', error);
    throw new Error('Database error');
  }
}



export const checkRoleRepo = async (roleId: number): Promise<boolean> => {
  try {
    const role = await prisma.roles.findFirst({
      where: {
        id: roleId,
        recordStatus: RecordStatus.ACTIVE
      },
    });
    return role !== null;
  } catch (error) {
    console.error('Error checking role existence:', error);
    throw new Error('Database error');
  }
};