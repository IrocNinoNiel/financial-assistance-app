import { academicYear, Prisma, PrismaClient } from "@prisma/client";
import { RecordStatus, uuidToBinary } from "../utils";

const prisma = new PrismaClient({  });

export const createAcadYearRepo = async(data: Prisma.academicYearUncheckedCreateInput): Promise<academicYear> => {
    return prisma.academicYear.create({ data });
}

export const getAllAcadYearRepo = async(): Promise<any> => {
    return prisma.academicYear.findMany({ where: {record_status: RecordStatus.ACTIVE}});
}

export const getByIdAcadYearRepo = async (id: string): Promise<any> => {
    return prisma.academicYear.findUnique({ where: { id: uuidToBinary(id) } });
}

export const updateAcadYearRepo = async (id: string, data: Prisma.academicYearUncheckedUpdateInput): Promise<any> => {
    return prisma.academicYear.update({ where: { id: uuidToBinary(id) }, data });
}

export const deleteAcadYearRepo = async (id: string): Promise<void> => {
    prisma.academicYear.update({ where: { id: uuidToBinary(id) }, data: {record_status: RecordStatus.DELETED} });
}