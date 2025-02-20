import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
   log: ["query"],
 });


export const getSchoolsRepo = async ( ): Promise<any> => {

   try {
      return await prisma.schools.findMany();
   } catch (error) {
      console.error('Error getRegionsRepo:', error);
      throw new Error('Database error');
   }

}