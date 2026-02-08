import { Prisma, PrismaClient, document_status } from "@prisma/client";

type TransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">;
import { binaryToUuid, extractUserFromToken, QueryParams, uuidToBinary } from "../utils";
import {
    all,
    checkApplicationExistsRepo,
    destroy,
    DocumentTrackingWithHistory,
    findIfExistsRepo,
    get,
    getByApplicationId,
    getByCode,
    getNextDocumentNumber,
    save,
    saveHistory,
    update
} from "./repository";
import { createNotification, NotificationType } from "../notification/service";

const prisma = new PrismaClient();

export interface CreateDocumentTrackingRequest {
    sponsorshipApplicationId: string;
    destination: string;
    dateSubmitted?: string;
    remarks?: string;
}

export interface UpdateDocumentStatusRequest {
    status: document_status;
    destination: string;
    remarks?: string;
}

export interface DocumentTrackingResponse {
    id: string;
    sponsorshipApplicationId: string;
    applicationNumber: string;
    studentName: string;
    sponsorshipName: string;
    documentCode: string;
    currentStatus: string;
    currentDestination: string;
    dateSubmitted: string | null;
    remarks: string | null;
    createdAt: string;
    updatedAt: string;
    history: DocumentHistoryResponse[];
}

export interface DocumentHistoryResponse {
    id: string;
    status: string;
    destination: string;
    remarks: string | null;
    actionDate: string;
    actionBy: string | null;
}

export interface PublicDocumentTrackingResponse {
    documentCode: string;
    currentStatus: string;
    currentDestination: string;
    dateSubmitted: string | null;
    lastUpdated: string;
    history: {
        status: string;
        destination: string;
        actionDate: string;
    }[];
}

const toDocumentTrackingResponse = (doc: DocumentTrackingWithHistory): DocumentTrackingResponse => {
    const studentName = `${doc.sponsorshipApplication.student.first_name} ${doc.sponsorshipApplication.student.middle_name || ''} ${doc.sponsorshipApplication.student.last_name}`.trim().replace(/\s+/g, ' ');

    return {
        id: binaryToUuid(doc.id),
        sponsorshipApplicationId: binaryToUuid(doc.sponsorship_application_id),
        applicationNumber: doc.sponsorshipApplication.app_id,
        studentName,
        sponsorshipName: doc.sponsorshipApplication.sponsorship.name,
        documentCode: doc.document_code,
        currentStatus: doc.current_status,
        currentDestination: doc.current_destination,
        dateSubmitted: doc.date_submitted ? doc.date_submitted.toISOString() : null,
        remarks: doc.remarks,
        createdAt: doc.created_at.toISOString(),
        updatedAt: doc.updated_at.toISOString(),
        history: doc.history.map(h => ({
            id: binaryToUuid(h.id),
            status: h.status,
            destination: h.destination,
            remarks: h.remarks,
            actionDate: h.action_date.toISOString(),
            actionBy: h.action_by ? binaryToUuid(h.action_by) : null
        }))
    };
};

const toPublicDocumentTrackingResponse = (doc: DocumentTrackingWithHistory): PublicDocumentTrackingResponse => {
    return {
        documentCode: doc.document_code,
        currentStatus: doc.current_status,
        currentDestination: doc.current_destination,
        dateSubmitted: doc.date_submitted ? doc.date_submitted.toISOString() : null,
        lastUpdated: doc.updated_at.toISOString(),
        history: doc.history.map(h => ({
            status: h.status,
            destination: h.destination,
            actionDate: h.action_date.toISOString()
        }))
    };
};

const generateDocumentCode = async (tx: TransactionClient): Promise<string> => {
    const currentYear = new Date().getFullYear();
    const nextNumber = await getNextDocumentNumber(tx as PrismaClient);
    return `DOC-${currentYear}-${nextNumber.toString().padStart(5, '0')}`;
};

export const store = async (
    payload: CreateDocumentTrackingRequest,
    authHeader: string
): Promise<DocumentTrackingResponse> => {
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;

    return await prisma.$transaction(async (tx) => {
        const documentCode = await generateDocumentCode(tx);

        const data: Prisma.documentTrackingUncheckedCreateInput = {
            sponsorship_application_id: uuidToBinary(payload.sponsorshipApplicationId),
            document_code: documentCode,
            current_status: document_status.RECEIVED,
            current_destination: payload.destination,
            date_submitted: payload.dateSubmitted ? new Date(payload.dateSubmitted) : new Date(),
            remarks: payload.remarks || null,
            created_by: uuidToBinary(userId),
            updated_by: uuidToBinary(userId)
        };

        const result = await save(data, tx as PrismaClient);

        // Create initial history entry
        await saveHistory({
            document_tracking_id: result.id,
            status: document_status.RECEIVED,
            destination: payload.destination,
            remarks: payload.remarks || null,
            action_by: uuidToBinary(userId)
        }, tx as PrismaClient);

        const document = await get(binaryToUuid(result.id), tx as PrismaClient);

        if (!document) {
            throw new Error('Failed to create document tracking record');
        }

        // Send notification to the student
        const studentUserId = binaryToUuid(document.sponsorshipApplication.student.users.id);
        await createNotification({
            userId: studentUserId,
            title: 'Document Tracking Created',
            message: `Your application document has been received. Track your document using code: ${documentCode}`,
            type: 'application' as NotificationType,
            referenceId: binaryToUuid(result.id)
        });

        return toDocumentTrackingResponse(document);
    });
};

export const updateStatus = async (
    documentId: string,
    payload: UpdateDocumentStatusRequest,
    authHeader: string
): Promise<DocumentTrackingResponse> => {
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;

    return await prisma.$transaction(async (tx) => {
        const data: Prisma.documentTrackingUncheckedUpdateInput = {
            current_status: payload.status,
            current_destination: payload.destination,
            remarks: payload.remarks || null,
            updated_by: uuidToBinary(userId)
        };

        await update(data, documentId, tx as PrismaClient);

        // Create history entry
        await saveHistory({
            document_tracking_id: uuidToBinary(documentId),
            status: payload.status,
            destination: payload.destination,
            remarks: payload.remarks || null,
            action_by: uuidToBinary(userId)
        }, tx as PrismaClient);

        const updatedDocument = await get(documentId, tx as PrismaClient);

        if (!updatedDocument) {
            throw new Error('Document not found');
        }

        // Send notification to the student
        const studentUserId = binaryToUuid(updatedDocument.sponsorshipApplication.student.users.id);
        await createNotification({
            userId: studentUserId,
            title: 'Document Status Updated',
            message: `Your document (${updatedDocument.document_code}) status has been updated to: ${payload.status}`,
            type: 'application' as NotificationType,
            referenceId: documentId
        });

        return toDocumentTrackingResponse(updatedDocument);
    });
};

export const fetch = async (id: string): Promise<DocumentTrackingResponse | null> => {
    const document = await get(id, prisma);
    if (!document) return null;
    return toDocumentTrackingResponse(document);
};

export const trackByCode = async (code: string): Promise<PublicDocumentTrackingResponse | null> => {
    const document = await getByCode(code, prisma);
    if (!document) return null;
    return toPublicDocumentTrackingResponse(document);
};

export const fetchByApplication = async (applicationId: string): Promise<DocumentTrackingResponse[]> => {
    const documents = await getByApplicationId(applicationId, prisma);
    return documents.map(toDocumentTrackingResponse);
};

export const list = async (params: QueryParams): Promise<DocumentTrackingResponse[]> => {
    const documents = await all(params, prisma);
    return documents.map(toDocumentTrackingResponse);
};

export const remove = async (id: string): Promise<void> => {
    await destroy(id, prisma);
};

export const findIfExists = async (id: string): Promise<boolean> => {
    return await findIfExistsRepo(id, prisma);
};

export const checkApplicationExists = async (applicationId: string): Promise<boolean> => {
    return await checkApplicationExistsRepo(applicationId, prisma);
};
