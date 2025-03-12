import { Prisma, PrismaClient, user } from '@prisma/client';
import { binaryToUuid, GetAllUsersParams, PartialStudentUser, RecordStatus, UserParameter, uuidToBinary } from '../utils';

const prisma = new PrismaClient({
  log: ["query"],
});


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

export const getAllUsersRepo = async ( params: UserParameter ) => {
    try {

      let whereCondition: any = { record_status: RecordStatus.ACTIVE }
      const sponsor = params.sponsor.toLowerCase() === "true";

      if(sponsor) {
        const role = await prisma.role.findUnique({where: {name: "Sponsor"}})
        whereCondition.role_id = role.id;
      }


      const users = await prisma.user.findMany({
        select: {
            username: true,
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
        where: whereCondition
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

export const checkIfNotSponsorRepo = async ( userId: string ) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: uuidToBinary(userId), record_status: RecordStatus.ACTIVE },
      select: { role_id: true }
    });

    if (!user) {
      return true;
    }

    const sponsorRole = await prisma.role.findFirst({
      where: { name: "Sponsor" },
      select: { id: true },
    });

    if(!sponsorRole) {
      return true
    }
    return binaryToUuid(user.role_id) !== binaryToUuid(sponsorRole.id);

  } catch (error) {
    console.error('Error updating user:', error);
  }
}
