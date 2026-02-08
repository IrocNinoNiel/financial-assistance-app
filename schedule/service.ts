import { Prisma, PrismaClient, schedule, schedule_type } from '@prisma/client';
import { binaryToUuid, extractUserFromToken, QueryParams, ScheduleModified, ScheduleRequest, ScheduleResponse, uuidToBinary } from "../utils"
import { convertedScheduleResponse, toScheduleModel } from "../utils/converter";
import { all, destroy, findIfExistsRepo, get, save, update } from "./repository";
import { generateSchedulePDFBuffer, SchedulePDFData } from "../pdf/generator";
import { createNotification, createNotificationsForUsers, NotificationType } from "../notification/service";

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

export const findIfExists = async ( id: string ): Promise<boolean> => {
    return await findIfExistsRepo( id, prisma );
}

// Get schedule with full details including students
export const getScheduleWithStudents = async (scheduleId: string) => {
    const schedule = await prisma.schedule.findUnique({
        where: { id: uuidToBinary(scheduleId) },
        include: {
            sponsorship: {
                select: {
                    id: true,
                    name: true,
                    sponsorshipApplication: {
                        where: {
                            record_status: true
                        },
                        select: {
                            id: true,
                            app_id: true,
                            student: {
                                select: {
                                    id: true,
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true,
                                    email: true,
                                    users: {
                                        select: {
                                            id: true,
                                            email: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!schedule) {
        throw new Error('Schedule not found');
    }

    return {
        id: binaryToUuid(schedule.id),
        sponsorshipId: binaryToUuid(schedule.sponsorship_id),
        sponsorshipName: schedule.sponsorship.name,
        batchNo: schedule.batch_no,
        scheduleType: schedule.schedule_type,
        location: schedule.location,
        startDate: schedule.start_date.toISOString(),
        endDate: schedule.end_date.toISOString(),
        scheduleQuota: schedule.schedule_quota,
        students: schedule.sponsorship.sponsorshipApplication.map(app => ({
            applicationId: binaryToUuid(app.id),
            applicationNumber: app.app_id,
            studentId: binaryToUuid(app.student.id),
            studentName: `${app.student.first_name} ${app.student.middle_name || ''} ${app.student.last_name}`.trim().replace(/\s+/g, ' '),
            email: app.student.email || app.student.users.email,
            userId: binaryToUuid(app.student.users.id)
        }))
    };
};

// Generate PDF for a specific student's schedule
export const generateSchedulePDFForStudent = async (scheduleId: string, studentId: string) => {
    const schedule = await prisma.schedule.findUnique({
        where: { id: uuidToBinary(scheduleId) },
        include: {
            sponsorship: {
                select: {
                    name: true
                }
            }
        }
    });

    if (!schedule) {
        throw new Error('Schedule not found');
    }

    const student = await prisma.student.findUnique({
        where: { id: uuidToBinary(studentId) },
        select: {
            first_name: true,
            middle_name: true,
            last_name: true
        }
    });

    if (!student) {
        throw new Error('Student not found');
    }

    const studentName = `${student.first_name} ${student.middle_name || ''} ${student.last_name}`.trim().replace(/\s+/g, ' ');

    const pdfData: SchedulePDFData = {
        scheduleType: schedule.schedule_type as 'TEST' | 'INTERVIEW',
        studentName,
        sponsorshipName: schedule.sponsorship.name,
        location: schedule.location,
        startDate: schedule.start_date,
        endDate: schedule.end_date,
        batchNo: schedule.batch_no
    };

    const buffer = await generateSchedulePDFBuffer(pdfData);

    return {
        buffer,
        fileName: `schedule_${schedule.schedule_type.toLowerCase()}_${studentId}.pdf`
    };
};

// Notify all students in a schedule with PDF and send in-app notifications
export const notifyAllStudentsWithPDF = async (scheduleId: string, authHeader: string) => {
    const userDetails = extractUserFromToken(authHeader);

    const scheduleData = await getScheduleWithStudents(scheduleId);

    const notifiedStudents: string[] = [];
    const errors: { studentId: string; error: string }[] = [];

    for (const student of scheduleData.students) {
        try {
            // Create in-app notification for each student
            await createNotification({
                userId: student.userId,
                title: `${scheduleData.scheduleType} Schedule Notification`,
                message: `You have been scheduled for ${scheduleData.scheduleType === 'TEST' ? 'an examination' : 'an interview'} on ${new Date(scheduleData.startDate).toLocaleDateString()} at ${scheduleData.location} for ${scheduleData.sponsorshipName}.`,
                type: 'schedule' as NotificationType,
                referenceId: scheduleId
            });

            notifiedStudents.push(student.studentId);
        } catch (err) {
            errors.push({
                studentId: student.studentId,
                error: err.message
            });
        }
    }

    return {
        scheduleId,
        scheduleType: scheduleData.scheduleType,
        totalStudents: scheduleData.students.length,
        notifiedCount: notifiedStudents.length,
        notifiedStudents,
        errors: errors.length > 0 ? errors : undefined
    };
};