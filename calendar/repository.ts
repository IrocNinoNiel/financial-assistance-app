import { PrismaClient } from "@prisma/client";
import { uuidToBinary, binaryToUuid } from "../utils";

export interface ScheduleEventRaw {
    id: Uint8Array;
    sponsorship_id: Uint8Array;
    batch_no: number;
    schedule_type: string;
    location: string;
    start_date: Date;
    end_date: Date;
    sponsorship: {
        name: string;
    };
}

export interface DeadlineEventRaw {
    id: Uint8Array;
    name: string;
    duration_to: Date;
    duration_from: Date;
}

export interface AnnouncementEventRaw {
    id: Uint8Array;
    title: string;
    caption: string;
    content: string;
    created_at: Date | null;
    sponsorship?: {
        name: string;
    } | null;
}

// Get schedules for a student (based on their sponsorship applications)
export const getStudentSchedules = async (
    studentId: string,
    startDate: Date,
    endDate: Date,
    prisma: PrismaClient
): Promise<ScheduleEventRaw[]> => {
    // First, get all sponsorship IDs the student has applied to
    const applications = await prisma.sponsorshipApplication.findMany({
        where: {
            student_id: uuidToBinary(studentId),
            record_status: true
        },
        select: {
            sponsorship_id: true
        }
    });

    const sponsorshipIds = applications.map(app => app.sponsorship_id);

    if (sponsorshipIds.length === 0) {
        return [];
    }

    // Get schedules for those sponsorships
    return await prisma.schedule.findMany({
        where: {
            sponsorship_id: { in: sponsorshipIds },
            record_status: true,
            start_date: { gte: startDate },
            end_date: { lte: endDate }
        },
        include: {
            sponsorship: {
                select: {
                    name: true
                }
            }
        },
        orderBy: { start_date: 'asc' }
    });
};

// Get deadlines for a student (sponsorship application deadlines)
export const getStudentDeadlines = async (
    studentId: string,
    startDate: Date,
    endDate: Date,
    prisma: PrismaClient
): Promise<DeadlineEventRaw[]> => {
    // Get sponsorships the student has applied to
    const applications = await prisma.sponsorshipApplication.findMany({
        where: {
            student_id: uuidToBinary(studentId),
            record_status: true
        },
        select: {
            sponsorship_id: true
        }
    });

    const sponsorshipIds = applications.map(app => app.sponsorship_id);

    if (sponsorshipIds.length === 0) {
        return [];
    }

    // Get sponsorships with upcoming deadlines
    return await prisma.sponsorship.findMany({
        where: {
            id: { in: sponsorshipIds },
            record_status: true,
            duration_to: {
                gte: startDate,
                lte: endDate
            }
        },
        select: {
            id: true,
            name: true,
            duration_to: true,
            duration_from: true
        },
        orderBy: { duration_to: 'asc' }
    });
};

// Get announcements for a student based on their municipality
export const getStudentAnnouncements = async (
    studentId: string,
    startDate: Date,
    endDate: Date,
    prisma: PrismaClient
): Promise<AnnouncementEventRaw[]> => {
    // Get student's municipality
    const student = await prisma.student.findUnique({
        where: { id: uuidToBinary(studentId) },
        select: {
            permanent_citymun_id: true,
            current_citymun_id: true
        }
    });

    if (!student) {
        return [];
    }

    const municipalityIds = [
        student.permanent_citymun_id,
        student.current_citymun_id
    ].filter((id): id is number => id !== null);

    if (municipalityIds.length === 0) {
        return [];
    }

    // Get announcements for the student's municipalities
    return await prisma.announcement.findMany({
        where: {
            record_status: true,
            created_at: {
                gte: startDate,
                lte: endDate
            },
            locations: {
                some: {
                    citymun_id: { in: municipalityIds }
                }
            }
        },
        select: {
            id: true,
            title: true,
            caption: true,
            content: true,
            created_at: true,
            sponsorship: {
                select: {
                    name: true
                }
            }
        },
        orderBy: { created_at: 'desc' }
    });
};

// Get all schedules (for admin)
export const getAllSchedules = async (
    startDate: Date,
    endDate: Date,
    prisma: PrismaClient
): Promise<ScheduleEventRaw[]> => {
    return await prisma.schedule.findMany({
        where: {
            record_status: true,
            start_date: { gte: startDate },
            end_date: { lte: endDate }
        },
        include: {
            sponsorship: {
                select: {
                    name: true
                }
            }
        },
        orderBy: { start_date: 'asc' }
    });
};

// Get schedules for a specific date
export const getSchedulesByDate = async (
    date: Date,
    prisma: PrismaClient
): Promise<ScheduleEventRaw[]> => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.schedule.findMany({
        where: {
            record_status: true,
            start_date: { lte: endOfDay },
            end_date: { gte: startOfDay }
        },
        include: {
            sponsorship: {
                select: {
                    name: true
                }
            }
        },
        orderBy: { start_date: 'asc' }
    });
};

// Get student by user ID
export const getStudentByUserId = async (
    userId: string,
    prisma: PrismaClient
) => {
    return await prisma.student.findFirst({
        where: {
            user_id: uuidToBinary(userId),
            record_status: true
        },
        select: {
            id: true
        }
    });
};
