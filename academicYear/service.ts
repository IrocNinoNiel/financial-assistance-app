import { academicYear, Prisma } from "@prisma/client";
import { AcademicYearRequest, AcademicYearResponse, extractUserFromToken } from "../utils";
import { checkAcademicYearIdRepo, checkExistingAcademicYearRepo, createAcadYearRepo, deleteOneAcadYearRepo, getAllAcadYearRepo, getOneAcadYearRepo, updateAcadYearRepo } from "./repository";
import { toAcadyearModel, toAcadyearResponse } from "../utils/converter";

export const createAcadYear = async ( payload: AcademicYearRequest, authHeader: any ) => {
    
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    const data: Prisma.academicYearUncheckedCreateInput = toAcadyearModel( payload, userId);
    const acadYear: academicYear = await createAcadYearRepo( data );
    return toAcadyearResponse( acadYear );
}

export const updateAcadYear = async ( payload: AcademicYearRequest, authHeader: any, academicYearId: string ) => {
    
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    const data: Prisma.academicYearUncheckedUpdateInput = toAcadyearModel( payload, userId);
    const acadYear: academicYear = await updateAcadYearRepo( academicYearId, data );
    return toAcadyearResponse( acadYear );
}

export const getAllAcadYear = async ():Promise<AcademicYearResponse[]> => {
    const data: any = await getAllAcadYearRepo();
    return data.map( item => toAcadyearResponse(item));
}

export const getOneAcadYear = async ( acadYearId: string ):Promise<AcademicYearResponse> => {
    const data: any = await getOneAcadYearRepo( acadYearId );
    return toAcadyearResponse(data);
}


export const checkExistingAcademicYear = async (academicYearStart: number, academicYearEnd: number, schoolTerm: number, academicYearId: any): Promise<boolean> => {
    return checkExistingAcademicYearRepo( academicYearStart,academicYearEnd,schoolTerm, academicYearId );
}

export const checkAcademicYearId = async ( academicYearId: string ): Promise<boolean> => {
    return checkAcademicYearIdRepo( academicYearId );
}

export const deleteOneAcadYear = async ( academicYearId: string ): Promise<void> => {
    await deleteOneAcadYearRepo( academicYearId );
}