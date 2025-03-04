import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
   log: ["query"],
 });

export const getregionRepo = async ( ): Promise<any> => {

   try {
      return await prisma.region.findMany();
   } catch (error) {
      console.error('Error getregionRepo:', error);
      throw new Error('Database error');
   }

}

export const getprovinceRepo = async ( regCode: string ): Promise<any> => {

   try {
      return await prisma.province.findMany({
         where: { reg_code: regCode },
      });
   } catch (error) {
      console.error('Error getprovinceRepo:', error);
      throw new Error('Database error');
   }

}

export const getcitymunRepo = async ( provinceCode: string ): Promise<any> => {

   try {
      return await prisma.citymun.findMany({
         where: { prov_code: provinceCode },
      });
   } catch (error) {
      console.error('Error getprovinceRepo:', error);
      throw new Error('Database error');
   }

}

export const getBarangaysRepo = async ( citymunCode: string ): Promise<any> => {

   try {
      return await prisma.barangay.findMany({
         where: { citymun_code: citymunCode },
      });
   } catch (error) {
      console.error('Error getprovinceRepo:', error);
      throw new Error('Database error');
   }

}

export const checkRegionExistRepo = async ( regCode: string, id: number ): Promise<boolean> => {
   try {
      const whereCondition: any = {};
        
      if (regCode || regCode !== "") whereCondition.reg_code = regCode;
      if (id > 0) whereCondition.id = id;

      const region = await prisma.region.findFirst({
          where: whereCondition,
      });
      
      return region === null; 
   } catch (error) {
      console.error('Error getregionRepo:', error);
      throw new Error('Database error');
   }
}

export const checkProvinceExistRepo = async ( provinceCode: string, id: number ): Promise<boolean> => {
   try {

      const whereCondition: any = {};
        
      if (provinceCode || provinceCode !== "") whereCondition.reg_code = provinceCode;
      if (id > 0) whereCondition.id = id;

      const province = await prisma.province.findFirst({
         where: whereCondition,
      });
      
      return province === null; 
   } catch (error) {
      console.error('Error getregionRepo:', error);
      throw new Error('Database error');
   }
}

export const checkCityMunExistRepo = async ( citymunCode: string, id: number ): Promise<boolean> => {
   try {

      const whereCondition: any = {};
        
      if (citymunCode || citymunCode !== "") whereCondition.reg_code = citymunCode;
      if (id > 0) whereCondition.id = id;

      const cityMun = await prisma.citymun.findFirst({
         where: whereCondition,
      });
      
      return cityMun === null; 
   } catch (error) {
      console.error('Error getregionRepo:', error);
      throw new Error('Database error');
   }
}

export const checkBarangayExistRepo = async ( brgCode: string, id: number ): Promise<boolean> => {
   try {

      const whereCondition: any = {};
        
      if (brgCode || brgCode !== "") whereCondition.brgy_code = brgCode;
      if (id > 0) whereCondition.id = id;

      const barangay = await prisma.barangay.findFirst({
         where: whereCondition,
      });
      
      return barangay === null; 
   } catch (error) {
      console.error('Error getregionRepo:', error);
      throw new Error('Database error');
   }
}

