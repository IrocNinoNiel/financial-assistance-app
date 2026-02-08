import { Router } from "express";
import { ResponseHandler } from "../response";
import {
    checkApplicationExists,
    CreateDocumentTrackingRequest,
    fetch,
    fetchByApplication,
    findIfExists,
    list,
    remove,
    store,
    trackByCode,
    updateStatus,
    UpdateDocumentStatusRequest
} from "./service";
import { getQueryParams, QueryParams } from "../utils";
import {
    validateCreateDocumentTracking,
    validateDocumentTrackingId,
    validateUpdateDocumentStatus
} from "../middleware/validation";
import { allowRoles } from "../middleware/authentication";

export default () => {
    const documentTrackingAPI = Router();

    // Create document tracking record
    documentTrackingAPI.post(
        '/',
        allowRoles('system admin', 'financial assistance coordinator'),
        validateCreateDocumentTracking,
        async (req, res) => {
            try {
                const authHeader: string = req.headers.authorization;
                const payload: CreateDocumentTrackingRequest = req.body;
                const data = await store(payload, authHeader);
                ResponseHandler.created(req, res, data);
            } catch (err) {
                ResponseHandler.invalidRequest(req, res, err.message);
            }
        }
    );

    // Update document status
    documentTrackingAPI.put(
        '/:documentId/status',
        allowRoles('system admin', 'financial assistance coordinator'),
        validateDocumentTrackingId,
        validateUpdateDocumentStatus,
        async (req, res) => {
            try {
                const { documentId } = req.params;
                const authHeader: string = req.headers.authorization;
                const payload: UpdateDocumentStatusRequest = req.body;
                const data = await updateStatus(documentId, payload, authHeader);
                ResponseHandler.updated(req, res, data);
            } catch (err) {
                ResponseHandler.invalidRequest(req, res, err.message);
            }
        }
    );

    // Get document by ID
    documentTrackingAPI.get(
        '/:documentId',
        validateDocumentTrackingId,
        async (req, res) => {
            try {
                const { documentId } = req.params;
                const data = await fetch(documentId);
                if (!data) {
                    return ResponseHandler.invalidRequest(req, res, 'Document not found');
                }
                ResponseHandler.ok(req, res, data);
            } catch (err) {
                ResponseHandler.invalidRequest(req, res, err.message);
            }
        }
    );

    // Get documents by application ID
    documentTrackingAPI.get(
        '/application/:applicationId',
        async (req, res) => {
            try {
                const { applicationId } = req.params;
                const exists = await checkApplicationExists(applicationId);
                if (!exists) {
                    return ResponseHandler.invalidRequest(req, res, 'Application not found');
                }
                const data = await fetchByApplication(applicationId);
                ResponseHandler.ok(req, res, data);
            } catch (err) {
                ResponseHandler.invalidRequest(req, res, err.message);
            }
        }
    );

    // List all documents (admin/coordinator)
    documentTrackingAPI.get(
        '/',
        allowRoles('system admin', 'financial assistance coordinator'),
        async (req, res) => {
            try {
                const params: QueryParams = getQueryParams(req);
                const data = await list(params);
                ResponseHandler.ok(req, res, data);
            } catch (err) {
                ResponseHandler.invalidRequest(req, res, err.message);
            }
        }
    );

    // Delete document tracking record
    documentTrackingAPI.delete(
        '/:documentId',
        allowRoles('system admin', 'financial assistance coordinator'),
        validateDocumentTrackingId,
        async (req, res) => {
            try {
                const { documentId } = req.params;
                await remove(documentId);
                ResponseHandler.deleted(req, res, 'Document tracking record deleted successfully');
            } catch (err) {
                ResponseHandler.invalidRequest(req, res, err.message);
            }
        }
    );

    return documentTrackingAPI;
};

// Public route for tracking by code (to be registered separately without authentication)
export const publicDocumentTrackingController = () => {
    const publicAPI = Router();

    // Track document by code (public endpoint)
    publicAPI.get(
        '/track/:code',
        async (req, res) => {
            try {
                const { code } = req.params;
                const data = await trackByCode(code);
                if (!data) {
                    return ResponseHandler.invalidRequest(req, res, 'Document not found');
                }
                ResponseHandler.ok(req, res, data);
            } catch (err) {
                ResponseHandler.invalidRequest(req, res, err.message);
            }
        }
    );

    return publicAPI;
};
