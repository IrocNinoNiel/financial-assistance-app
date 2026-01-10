import { Prisma, PrismaClient, resource } from "@prisma/client";
import { binaryToUuid, extractUserFromToken, QueryParams, uuidToBinary } from "../utils";
import {
    createResourceRepo,
    deleteResourceRepo,
    doesResourceExistRepo,
    getAllResourcesRepo,
    getOneResourceRepo,
    incrementDownloadCountRepo,
    updateResourceRepo
} from "./repository";

const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
});

export interface ResourcePayload {
    title: string;
    description?: string;
    category?: string;
}

export interface ResourceResponse {
    id: string;
    title: string;
    description: string | null;
    fileName: string;
    filePath: string;
    fileType: string;
    category: string | null;
    downloadCount: number;
    createdAt: Date;
}

const toResourceResponse = (resource: resource): ResourceResponse => {
    return {
        id: binaryToUuid(resource.id),
        title: resource.title,
        description: resource.description,
        fileName: resource.file_name,
        filePath: resource.file_path,
        fileType: resource.file_type,
        category: resource.category,
        downloadCount: resource.download_count,
        createdAt: resource.created_at
    };
};

export const createResource = async (
    payload: ResourcePayload,
    file: Express.Multer.File,
    authHeader: string
): Promise<ResourceResponse> => {
    const userDetails = extractUserFromToken(authHeader);
    const createdUserId = userDetails.userId;

    const data: Prisma.resourceUncheckedCreateInput = {
        title: payload.title,
        description: payload.description || null,
        file_name: file.originalname,
        file_path: file.path,
        file_type: file.mimetype,
        category: payload.category || null,
        created_by: uuidToBinary(createdUserId),
        updated_by: uuidToBinary(createdUserId)
    };

    const result = await createResourceRepo(data, prisma);
    return toResourceResponse(result);
};

export const updateResource = async (
    payload: ResourcePayload,
    resourceId: string,
    file: Express.Multer.File | undefined,
    authHeader: string
): Promise<ResourceResponse> => {
    const userDetails = extractUserFromToken(authHeader);
    const updatedUserId = userDetails.userId;

    const data: Prisma.resourceUncheckedUpdateInput = {
        title: payload.title,
        description: payload.description || null,
        category: payload.category || null,
        updated_by: uuidToBinary(updatedUserId)
    };

    // If new file is uploaded, update file fields
    if (file) {
        data.file_name = file.originalname;
        data.file_path = file.path;
        data.file_type = file.mimetype;
    }

    const result = await updateResourceRepo(data, resourceId, prisma);
    return toResourceResponse(result);
};

export const getOneResource = async (resourceId: string): Promise<ResourceResponse | null> => {
    const resource = await getOneResourceRepo(resourceId, prisma);
    if (!resource) return null;
    return toResourceResponse(resource);
};

export const getAllResources = async (params: QueryParams): Promise<ResourceResponse[]> => {
    const resources = await getAllResourcesRepo(params, prisma);
    return resources.map(toResourceResponse);
};

export const deleteResource = async (resourceId: string): Promise<void> => {
    await deleteResourceRepo(resourceId, prisma);
};

export const downloadResource = async (resourceId: string): Promise<resource | null> => {
    const resource = await getOneResourceRepo(resourceId, prisma);
    if (resource) {
        await incrementDownloadCountRepo(resourceId, prisma);
    }
    return resource;
};

export const doesResourceExist = async (resourceId: string): Promise<boolean> => {
    return await doesResourceExistRepo(resourceId, prisma);
};
