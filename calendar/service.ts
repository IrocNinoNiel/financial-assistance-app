import { PrismaClient } from "@prisma/client";
import { binaryToUuid, extractUserFromToken, uuidToBinary } from "../utils";
import {
    getAllSchedules,
    getSchedulesByDate,
    getStudentAnnouncements,
    getStudentByUserId,
    getStudentDeadlines,
    getStudentSchedules,
    ScheduleEventRaw,
    DeadlineEventRaw,
    AnnouncementEventRaw
} from "./repository";
import icalGenerator, { ICalCalendar, ICalEventData } from 'ical-generator';

const prisma = new PrismaClient();

export type EventType = 'SCHEDULE' | 'DEADLINE' | 'ANNOUNCEMENT';

export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    eventType: EventType;
    startDate: string;
    endDate: string;
    location?: string;
    metadata: {
        sponsorshipName?: string;
        scheduleType?: string;
        batchNo?: number;
        [key: string]: any;
    };
}

export interface CalendarSummary {
    schedules: number;
    deadlines: number;
    announcements: number;
    total: number;
}

export interface CalendarResponse {
    events: CalendarEvent[];
    summary: CalendarSummary;
}

export interface CalendarQueryParams {
    startDate?: string;
    endDate?: string;
    eventTypes?: EventType[];
}

const parseQueryParams = (params: CalendarQueryParams) => {
    const now = new Date();
    const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
    const defaultEndDate = new Date(now.getFullYear(), now.getMonth() + 3, 0); // Last day of 3 months from now

    return {
        startDate: params.startDate ? new Date(params.startDate) : defaultStartDate,
        endDate: params.endDate ? new Date(params.endDate) : defaultEndDate,
        eventTypes: params.eventTypes || ['SCHEDULE', 'DEADLINE', 'ANNOUNCEMENT'] as EventType[]
    };
};

const convertScheduleToEvent = (schedule: ScheduleEventRaw): CalendarEvent => {
    return {
        id: binaryToUuid(schedule.id),
        title: `${schedule.schedule_type}: ${schedule.sponsorship.name}`,
        description: `${schedule.schedule_type === 'TEST' ? 'Examination' : 'Interview'} for ${schedule.sponsorship.name} - Batch ${schedule.batch_no}`,
        eventType: 'SCHEDULE',
        startDate: schedule.start_date.toISOString(),
        endDate: schedule.end_date.toISOString(),
        location: schedule.location,
        metadata: {
            sponsorshipName: schedule.sponsorship.name,
            scheduleType: schedule.schedule_type,
            batchNo: schedule.batch_no
        }
    };
};

const convertDeadlineToEvent = (deadline: DeadlineEventRaw): CalendarEvent => {
    return {
        id: binaryToUuid(deadline.id),
        title: `DEADLINE: ${deadline.name}`,
        description: `Application deadline for ${deadline.name}`,
        eventType: 'DEADLINE',
        startDate: deadline.duration_to.toISOString(),
        endDate: deadline.duration_to.toISOString(),
        metadata: {
            sponsorshipName: deadline.name,
            applicationPeriodStart: deadline.duration_from.toISOString()
        }
    };
};

const convertAnnouncementToEvent = (announcement: AnnouncementEventRaw): CalendarEvent => {
    const eventDate = announcement.created_at ? announcement.created_at.toISOString() : new Date().toISOString();
    return {
        id: binaryToUuid(announcement.id),
        title: `ANNOUNCEMENT: ${announcement.title}`,
        description: announcement.caption || announcement.content.substring(0, 200),
        eventType: 'ANNOUNCEMENT',
        startDate: eventDate,
        endDate: eventDate,
        metadata: {
            sponsorshipName: announcement.sponsorship?.name
        }
    };
};

// Get current student's events
export const getMyEvents = async (
    authHeader: string,
    params: CalendarQueryParams
): Promise<CalendarResponse> => {
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;

    // Get student ID from user ID
    const student = await getStudentByUserId(userId, prisma);
    if (!student) {
        throw new Error('Student profile not found for this user');
    }

    const studentId = binaryToUuid(student.id);
    return await getStudentEvents(studentId, params);
};

// Get events for a specific student
export const getStudentEvents = async (
    studentId: string,
    params: CalendarQueryParams
): Promise<CalendarResponse> => {
    const { startDate, endDate, eventTypes } = parseQueryParams(params);

    const events: CalendarEvent[] = [];

    // Get schedules
    if (eventTypes.includes('SCHEDULE')) {
        const schedules = await getStudentSchedules(studentId, startDate, endDate, prisma);
        events.push(...schedules.map(convertScheduleToEvent));
    }

    // Get deadlines
    if (eventTypes.includes('DEADLINE')) {
        const deadlines = await getStudentDeadlines(studentId, startDate, endDate, prisma);
        events.push(...deadlines.map(convertDeadlineToEvent));
    }

    // Get announcements
    if (eventTypes.includes('ANNOUNCEMENT')) {
        const announcements = await getStudentAnnouncements(studentId, startDate, endDate, prisma);
        events.push(...announcements.map(convertAnnouncementToEvent));
    }

    // Sort events by start date
    events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const summary: CalendarSummary = {
        schedules: events.filter(e => e.eventType === 'SCHEDULE').length,
        deadlines: events.filter(e => e.eventType === 'DEADLINE').length,
        announcements: events.filter(e => e.eventType === 'ANNOUNCEMENT').length,
        total: events.length
    };

    return { events, summary };
};

// Get all schedule events (for admin)
export const getAdminEvents = async (
    params: CalendarQueryParams
): Promise<CalendarResponse> => {
    const { startDate, endDate } = parseQueryParams(params);

    const schedules = await getAllSchedules(startDate, endDate, prisma);
    const events = schedules.map(convertScheduleToEvent);

    // Sort events by start date
    events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const summary: CalendarSummary = {
        schedules: events.length,
        deadlines: 0,
        announcements: 0,
        total: events.length
    };

    return { events, summary };
};

// Get events for a specific date
export const getEventsByDate = async (
    date: string,
    authHeader: string
): Promise<CalendarResponse> => {
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;

    // Get student ID from user ID
    const student = await getStudentByUserId(userId, prisma);
    if (!student) {
        throw new Error('Student profile not found for this user');
    }

    const studentId = binaryToUuid(student.id);
    const targetDate = new Date(date);

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    return await getStudentEvents(studentId, {
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString()
    });
};

// Export calendar as iCal format
export const exportICalendar = async (authHeader: string): Promise<string> => {
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;

    // Get student ID from user ID
    const student = await getStudentByUserId(userId, prisma);
    if (!student) {
        throw new Error('Student profile not found for this user');
    }

    const studentId = binaryToUuid(student.id);

    // Get events for the next 6 months
    const now = new Date();
    const sixMonthsLater = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());

    const { events } = await getStudentEvents(studentId, {
        startDate: now.toISOString(),
        endDate: sixMonthsLater.toISOString()
    });

    // Create iCal calendar
    const calendar = icalGenerator({
        name: 'Financial Assistance Schedule',
        prodId: { company: 'FINAS', product: 'Calendar' },
        timezone: 'Asia/Manila'
    });

    // Add events to calendar
    events.forEach(event => {
        const icalEvent: ICalEventData = {
            id: event.id,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
            summary: event.title,
            description: event.description,
            location: event.location
        };

        calendar.createEvent(icalEvent);
    });

    return calendar.toString();
};

// Check if user has student profile
export const hasStudentProfile = async (authHeader: string): Promise<boolean> => {
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;

    const student = await getStudentByUserId(userId, prisma);
    return !!student;
};
