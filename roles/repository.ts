import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
   log: ["query"],
 });


export const getRolesRepo = async ( ): Promise<any> => {

   try {
      return await prisma.role.findMany();
   } catch (error) {
      console.error('Error getRegionsRepo:', error);
      throw new Error('Database error');
   }

}