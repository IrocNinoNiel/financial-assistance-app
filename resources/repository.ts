import { Prisma, PrismaClient, resource } from "@prisma/client";
import { QueryParams, RecordStatus, uuidToBinary } from "../utils";

export const createResourceRepo = async (
    data: Prisma.resourceUncheckedCreateInput,
    prisma: PrismaClient
): Promise<resource> => {
    return await prisma.resource.create({ data });
};

export const updateResourceRepo = async (
    data: Prisma.resourceUncheckedUpdateInput,
    resourceId: string,
    prisma: PrismaClient
): Promise<resource> => {
    return await prisma.resource.update({
        data,
        where: { id: uuidToBinary(resourceId) }
    });
};

export const getOneResourceRepo = async (
    resourceId: string,
    prisma: PrismaClient
): Promise<resource | null> => {
    return await prisma.resource.findUnique({
        where: {
            id: uuidToBinary(resourceId),
            record_status: RecordStatus.ACTIVE
        }
    });
};

export const getAllResourcesRepo = async (
    params: QueryParams,
    prisma: PrismaClient
): Promise<resource[]> => {
    let orderBy: any = {};
    let whereCondition: any = { record_status: RecordStatus.ACTIVE };

    if (params.sort) {
        orderBy['created_at'] = params.sort === 'desc' ? 'desc' : 'asc';
    }

    if (params.search && params.search !== "") {
        whereCondition.OR = [
            { title: { contains: params.search } },
            { description: { contains: params.search } },
            { category: { contains: params.search } }
        ];
    }

    return await prisma.resource.findMany({
        where: whereCondition,
        skip: params.offset,
        take: params.limit,
        orderBy
    });
};

export const deleteResourceRepo = async (
    resourceId: string,
    prisma: PrismaClient
): Promise<void> => {
    await prisma.resource.update({
        data: { record_status: false },
        where: { id: uuidToBinary(resourceId) }
    });
};

export const incrementDownloadCountRepo = async (
    resourceId: string,
    prisma: PrismaClient
): Promise<void> => {
    await prisma.resource.update({
        data: { download_count: { increment: 1 } },
        where: { id: uuidToBinary(resourceId) }
    });
};

export const doesResourceExistRepo = async (
    resourceId: string,
    prisma: PrismaClient
): Promise<boolean> => {
    const resource = await prisma.resource.findUnique({
        where: {
            id: uuidToBinary(resourceId),
            record_status: RecordStatus.ACTIVE
        }
    });
    return !!resource;
};
