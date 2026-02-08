import { Router } from "express";
import { ResponseHandler } from "../response";
import {
    getMyEvents,
    getStudentEvents,
    getAdminEvents,
    getEventsByDate,
    exportICalendar,
    CalendarQueryParams,
    EventType
} from "./service";
import { validateCalendarQuery, validateStudentId } from "../middleware/validation";
import { allowRoles } from "../middleware/authentication";

export default () => {
    const calendarAPI = Router();

    // Get current student's events
    calendarAPI.get('/my-events', validateCalendarQuery, async (req, res) => {
        try {
            const authHeader: string = req.headers.authorization;
            const params: CalendarQueryParams = {
                startDate: req.query.startDate as string,
                endDate: req.query.endDate as string,
                eventTypes: req.query.eventTypes
                    ? (req.query.eventTypes as string).split(',') as EventType[]
                    : undefined
            };

            const data = await getMyEvents(authHeader, params);
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req, res, err.message);
        }
    });

    // Get specific student's events (admin/coordinator)
    calendarAPI.get(
        '/student/:studentId',
        allowRoles('system admin', 'financial assistance coordinator'),
        validateCalendarQuery,
        async (req, res) => {
            try {
                const { studentId } = req.params;
                const params: CalendarQueryParams = {
                    startDate: req.query.startDate as string,
                    endDate: req.query.endDate as string,
                    eventTypes: req.query.eventTypes
                        ? (req.query.eventTypes as string).split(',') as EventType[]
                        : undefined
                };

                const data = await getStudentEvents(studentId, params);
                ResponseHandler.ok(req, res, data);
            } catch (err) {
                ResponseHandler.invalidRequest(req, res, err.message);
            }
        }
    );

    // Get all schedule events (admin)
    calendarAPI.get(
        '/admin',
        allowRoles('system admin', 'financial assistance coordinator'),
        validateCalendarQuery,
        async (req, res) => {
            try {
                const params: CalendarQueryParams = {
                    startDate: req.query.startDate as string,
                    endDate: req.query.endDate as string
                };

                const data = await getAdminEvents(params);
                ResponseHandler.ok(req, res, data);
            } catch (err) {
                ResponseHandler.invalidRequest(req, res, err.message);
            }
        }
    );

    // Export calendar as iCal file
    calendarAPI.get('/export/ical', async (req, res) => {
        try {
            const authHeader: string = req.headers.authorization;
            const icalData = await exportICalendar(authHeader);

            res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
            res.setHeader('Content-Disposition', 'attachment; filename="financial-assistance-calendar.ics"');
            res.send(icalData);
        } catch (err) {
            ResponseHandler.invalidRequest(req, res, err.message);
        }
    });

    // Get events for a specific date
    calendarAPI.get('/date/:date', async (req, res) => {
        try {
            const { date } = req.params;
            const authHeader: string = req.headers.authorization;

            // Validate date format
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                return ResponseHandler.invalidRequest(req, res, 'Invalid date format. Use YYYY-MM-DD');
            }

            const data = await getEventsByDate(date, authHeader);
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req, res, err.message);
        }
    });

    return calendarAPI;
};
