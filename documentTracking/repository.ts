import { Prisma, PrismaClient, documentTracking, documentTrackingHistory, document_status } from "@prisma/client";
import { QueryParams, RecordStatus, uuidToBinary } from "../utils";

export type DocumentTrackingWithHistory = documentTracking & {
    history: documentTrackingHistory[];
    sponsorshipApplication: {
        app_id: string;
        student: {
            first_name: string;
            middle_name: string | null;
            last_name: string;
            users: {
                id: Uint8Array;
                email: string;
            };
        };
        sponsorship: {
            name: string;
        };
    };
};

export const save = async (
    data: Prisma.documentTrackingUncheckedCreateInput,
    prisma: PrismaClient
): Promise<documentTracking> => {
    return await prisma.documentTracking.create({ data });
};

export const saveHistory = async (
    data: Prisma.documentTrackingHistoryUncheckedCreateInput,
    prisma: PrismaClient
): Promise<documentTrackingHistory> => {
    return await prisma.documentTrackingHistory.create({ data });
};

export const update = async (
    data: Prisma.documentTrackingUncheckedUpdateInput,
    id: string,
    prisma: PrismaClient
): Promise<documentTracking> => {
    return await prisma.documentTracking.update({
        data,
        where: { id: uuidToBinary(id) }
    });
};

export const destroy = async (
    id: string,
    prisma: PrismaClient
): Promise<documentTracking> => {
    return await prisma.documentTracking.update({
        data: { record_status: RecordStatus.DELETED },
        where: { id: uuidToBinary(id) }
    });
};

export const get = async (
    id: string,
    prisma: PrismaClient
): Promise<DocumentTrackingWithHistory | null> => {
    return await prisma.documentTracking.findUnique({
        where: { id: uuidToBinary(id), record_status: RecordStatus.ACTIVE },
        include: {
            history: {
                orderBy: { action_date: 'desc' }
            },
            sponsorshipApplication: {
                select: {
                    app_id: true,
                    student: {
                        select: {
                            first_name: true,
                            middle_name: true,
                            last_name: true,
                            users: {
                                select: {
                                    id: true,
                                    email: true
                                }
                            }
                        }
                    },
                    sponsorship: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });
};

export const getByCode = async (
    code: string,
    prisma: PrismaClient
): Promise<DocumentTrackingWithHistory | null> => {
    return await prisma.documentTracking.findUnique({
        where: { document_code: code, record_status: RecordStatus.ACTIVE },
        include: {
            history: {
                orderBy: { action_date: 'desc' }
            },
            sponsorshipApplication: {
                select: {
                    app_id: true,
                    student: {
                        select: {
                            first_name: true,
                            middle_name: true,
                            last_name: true,
                            users: {
                                select: {
                                    id: true,
                                    email: true
                                }
                            }
                        }
                    },
                    sponsorship: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });
};

export const getByApplicationId = async (
    applicationId: string,
    prisma: PrismaClient
): Promise<DocumentTrackingWithHistory[]> => {
    return await prisma.documentTracking.findMany({
        where: {
            sponsorship_application_id: uuidToBinary(applicationId),
            record_status: RecordStatus.ACTIVE
        },
        include: {
            history: {
                orderBy: { action_date: 'desc' }
            },
            sponsorshipApplication: {
                select: {
                    app_id: true,
                    student: {
                        select: {
                            first_name: true,
                            middle_name: true,
                            last_name: true,
                            users: {
                                select: {
                                    id: true,
                                    email: true
                                }
                            }
                        }
                    },
                    sponsorship: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        },
        orderBy: { created_at: 'desc' }
    });
};

export const all = async (
    params: QueryParams,
    prisma: PrismaClient
): Promise<DocumentTrackingWithHistory[]> => {
    let orderBy: any = {};
    let whereCondition: any = { record_status: RecordStatus.ACTIVE };

    if (params.sort) {
        orderBy['created_at'] = params.sort === 'desc' ? 'desc' : 'asc';
    }

    if (params.search && params.search !== "") {
        whereCondition.OR = [
            { document_code: { contains: params.search } },
            { current_destination: { contains: params.search } },
            { remarks: { contains: params.search } }
        ];
    }

    return await prisma.documentTracking.findMany({
        where: whereCondition,
        include: {
            history: {
                orderBy: { action_date: 'desc' }
            },
            sponsorshipApplication: {
                select: {
                    app_id: true,
                    student: {
                        select: {
                            first_name: true,
                            middle_name: true,
                            last_name: true,
                            users: {
                                select: {
                                    id: true,
                                    email: true
                                }
                            }
                        }
                    },
                    sponsorship: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        },
        skip: params.offset,
        take: params.limit,
        orderBy
    });
};

export const findIfExistsRepo = async (
    id: string,
    prisma: PrismaClient
): Promise<boolean> => {
    const result = await prisma.documentTracking.findFirst({
        where: {
            id: uuidToBinary(id),
            record_status: RecordStatus.ACTIVE
        }
    });
    return !!result;
};

export const getNextDocumentNumber = async (
    prisma: PrismaClient
): Promise<number> => {
    const currentYear = new Date().getFullYear();
    const yearPrefix = `DOC-${currentYear}-`;

    const lastDocument = await prisma.documentTracking.findFirst({
        where: {
            document_code: {
                startsWith: yearPrefix
            }
        },
        orderBy: {
            document_code: 'desc'
        }
    });

    if (!lastDocument) {
        return 1;
    }

    const lastNumber = parseInt(lastDocument.document_code.replace(yearPrefix, ''), 10);
    return lastNumber + 1;
};

export const checkApplicationExistsRepo = async (
    applicationId: string,
    prisma: PrismaClient
): Promise<boolean> => {
    const result = await prisma.sponsorshipApplication.findFirst({
        where: {
            id: uuidToBinary(applicationId),
            record_status: true
        }
    });
    return !!result;
};
