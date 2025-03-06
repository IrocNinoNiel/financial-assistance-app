import { academicYear, Prisma, PrismaClient } from "@prisma/client";
import { RecordStatus, uuidToBinary } from "../utils";

const prisma = new PrismaClient({  });

export const createAcadYearRepo = async(data: Prisma.academicYearUncheckedCreateInput): Promise<academicYear> => {
    return await prisma.academicYear.create({ data });
}

export const getAllAcadYearRepo = async(): Promise<any> => {
    return await prisma.academicYear.findMany({ where: {record_status: RecordStatus.ACTIVE}});
}

export const getOneAcadYearRepo = async (id: string): Promise<any> => {
    return await prisma.academicYear.findUnique({ where: { id: uuidToBinary(id) } });
}

export const updateAcadYearRepo = async (id: string, data: Prisma.academicYearUncheckedUpdateInput): Promise<any> => {
    return await prisma.academicYear.update({ where: { id: uuidToBinary(id) }, data });
}

export const deleteOneAcadYearRepo = async (id: string) => {
    await prisma.academicYear.update({ where: { id: uuidToBinary(id) }, data: {record_status: RecordStatus.DELETED } });
}

export const checkExistingAcademicYearRepo = async (academicYearStart: number, academicYearEnd: number, schoolTerm: number, academicYearId: any): Promise<boolean> => {
   
    const whereCondition: any =  {
        academic_year_start: academicYearStart,
        academic_year_end: academicYearEnd,
        school_term: schoolTerm,
    };

     if (academicYearId) {
        whereCondition.id = { not: uuidToBinary(academicYearId) };
     }


    const data =  await prisma.academicYear.findFirst({
        where: whereCondition,
    });
    return data !== null;
}


export const checkAcademicYearIdRepo = async ( academicYearId: string ): Promise<boolean> => {
    const data =  await prisma.academicYear.findFirst({
        where: {
          id: uuidToBinary(academicYearId),
          record_status: RecordStatus.ACTIVE
        },
    });
    return data === null;
}

