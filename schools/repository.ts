import { PrismaClient } from "@prisma/client";
import { uuidToBinary } from "../utils";

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

export const checkSchoolExistRepo = async ( id: string ): Promise<boolean> => {
   try {

      console.log("School ID", id);
      const whereCondition: any = {};
      if (id !== null) whereCondition.id = uuidToBinary(id);

      const school = await prisma.schools.findFirst({
         where: whereCondition,
      });
      
      console.log("School Data", school);
      return school === null; 
   } catch (error) {
      console.error('Error getRegionsRepo:', error);
      throw new Error('Database error');
   }
}