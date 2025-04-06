import { Prisma, PrismaClient, schedule } from '@prisma/client';
import { binaryToUuid, extractUserFromToken, QueryParams, ScheduleModified, ScheduleRequest, ScheduleResponse } from "../utils"
import { convertedScheduleResponse, toScheduleModel } from "../utils/converter";
import { all, destroy, get, save, update } from "./repository";

const prisma = new PrismaClient({
    // log: ["query", "info", "warn", "error"],
});


export const store = async ( payload: ScheduleRequest, authHeader: string) : Promise<ScheduleResponse> => {

    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    const payloadConverted: Prisma.scheduleUncheckedCreateInput = toScheduleModel( payload, userId );
    return await prisma.$transaction(async (prisma: PrismaClient) => { 
        const result: schedule = await save( payloadConverted, prisma );
        const response: ScheduleModified = await get( binaryToUuid(result.id), prisma);
        return convertedScheduleResponse( response );
    });
}

export const edit = async ( payload: ScheduleRequest, id: string, authHeader: string ) : Promise<ScheduleResponse> => {
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    const payloadConverted: Prisma.scheduleUncheckedCreateInput = toScheduleModel( payload, userId, true );
    return await prisma.$transaction(async (prisma: PrismaClient) => {  
        const result: schedule = await update( payloadConverted, id, prisma );
        const response: ScheduleModified = await get( binaryToUuid(result.id), prisma);
        return convertedScheduleResponse( response );
    });
}

export const list = async ( authHeader: string, params: QueryParams ) : Promise<ScheduleResponse[]> => {
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;

    const response: ScheduleModified[] = await all( params, userId, prisma );
    return response.map(e => convertedScheduleResponse( e ) )
}

export const fetch = async ( id: string ) : Promise<ScheduleResponse> => {

    const response: ScheduleModified = await get( id, prisma );
    return convertedScheduleResponse( response );
}

export const remove = async ( id: string ) => {
    await destroy( id, prisma );
}