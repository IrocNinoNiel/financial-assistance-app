import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
   log: ["query"],
 });

export const getRegionsRepo = async ( ): Promise<any> => {

   try {
      return await prisma.regions.findMany();
   } catch (error) {
      console.error('Error getRegionsRepo:', error);
      throw new Error('Database error');
   }

}

export const getProvincesRepo = async ( regCode: string ): Promise<any> => {

   try {
      return await prisma.provinces.findMany({
         where: { reg_code: regCode },
      });
   } catch (error) {
      console.error('Error getProvincesRepo:', error);
      throw new Error('Database error');
   }

}

export const getCityMunsRepo = async ( provinceCode: string ): Promise<any> => {

   try {
      return await prisma.citymuns.findMany({
         where: { prov_code: provinceCode },
      });
   } catch (error) {
      console.error('Error getProvincesRepo:', error);
      throw new Error('Database error');
   }

}

export const getBarangaysRepo = async ( citymunCode: string ): Promise<any> => {

   try {
      return await prisma.barangays.findMany({
         where: { citymun_code: citymunCode },
      });
   } catch (error) {
      console.error('Error getProvincesRepo:', error);
      throw new Error('Database error');
   }

}

export const checkRegionExistRepo = async ( regCode: string ): Promise<boolean> => {
   try {
      const region = await prisma.regions.findFirst({
         where: { reg_code: regCode },
      });
      
      return region === null; 
   } catch (error) {
      console.error('Error getRegionsRepo:', error);
      throw new Error('Database error');
   }
}

export const checkProvinceExistRepo = async ( provinceCode: string ): Promise<boolean> => {
   try {
      const province = await prisma.provinces.findFirst({
         where: { prov_code: provinceCode },
      });
      
      return province === null; 
   } catch (error) {
      console.error('Error getRegionsRepo:', error);
      throw new Error('Database error');
   }
}

export const checkCityMunExistRepo = async ( citymunCode: string ): Promise<boolean> => {
   try {
      const cityMun = await prisma.citymuns.findFirst({
         where: { citymun_code: citymunCode },
      });
      
      return cityMun === null; 
   } catch (error) {
      console.error('Error getRegionsRepo:', error);
      throw new Error('Database error');
   }
}