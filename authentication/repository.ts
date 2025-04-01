import { Prisma, PrismaClient, user } from '@prisma/client';
import { binaryToUuid, RecordStatus, uuidToBinary } from '../utils';
import { User, UserRole } from './model';
import { notEqual } from 'assert';

const prisma = new PrismaClient({
  log: ["query"],
});

export const checkEmailExistsRepo = async (email: string, userId?: string): Promise<boolean> => {
  try {
    const whereCondition: any = {
      email: email,
      record_status: RecordStatus.ACTIVE,
    };

    if (userId) {
      whereCondition.NOT = { id: uuidToBinary(userId) };
    }

    const user = await prisma.user.findFirst({
      where: whereCondition,
    });

    return user !== null;
  } catch (error) {
    console.error('Error checking email existence:', error);
    throw new Error('Database error');
  }
};

export const checkUsernameExistsRepo = async (username: string, userId?: string): Promise<boolean> => {
  try {
    const whereCondition: any = {
      username: username,
      record_status: RecordStatus.ACTIVE,
    };

    if (userId) {
      whereCondition.NOT = { id: uuidToBinary(userId) };
    }

    const user = await prisma.user.findFirst({
      where: whereCondition,
    });

    return user !== null;
  } catch (error) {
    console.error('Error checking email existence:', error);
    throw new Error('Database error');
  }
};

export const checkUserExists = async (username: string) : Promise<any>  => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: username,
          record_status: RecordStatus.ACTIVE
        },
      });
  
      return user;
    } catch (error) {
      console.error('Error checking email existence:', error);
      throw new Error('Database error');
    }
}

export const getUserDetails = async (userId: string) : Promise<user>  => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: uuidToBinary(userId),
        record_status: RecordStatus.ACTIVE
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
    const user = await prisma.role.findFirst({
      where: {
        name: name,
        record_status: RecordStatus.ACTIVE
      },
    });

    return user;
  } catch (error) {
    console.error('Error checking role existence:', error);
    throw new Error('Database error');
  }
}

export const registerRepo = async (user: Prisma.userUncheckedCreateInput) : Promise<any> => {
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

export const getPermission = async (roleId: string ) : Promise<any> => {
  try {
    const permission = await prisma.modulePermission.findMany({
      where: {
        role_id: uuidToBinary(roleId),
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


export const checkRoleRepo = async (roleId: string): Promise<boolean> => {
  try {
    const role = await prisma.role.findFirst({
      where: {
        id: uuidToBinary(roleId),
        record_status: RecordStatus.ACTIVE
      },
    });
    return role !== null;
  } catch (error) {
    console.error('Error checking role existence:', error);
    throw new Error('Database error');
  }
};

export const changePasswordRepo = async (userId: string, password: string) => {
  try {
    await prisma.user.update({
      where: { id: uuidToBinary(userId) },
      data: { password }
    });
  } catch (error) {
    console.error('Error in change password:', error);
    throw new Error('Database error');
  }
}

export const getUserRoleRepo = async ( userId: string ): Promise<string> => {
  try {
    const userRole = await prisma.user.findUnique({
      where: {
        id: uuidToBinary(userId)
      },
      select: {
        role: { select: { name: true}}
      }
    })

    if (!userRole || !userRole.role) {
      console.warn(`Role not found for user with ID: ${userId}`);
      return null;
    }

    return userRole.role.name.toLowerCase();
  } catch (error) {
    console.error('Error in change password:', error);
    throw new Error('Database error in getUserRoleRepo');
  }
}