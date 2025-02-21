import { PrismaClient } from '@prisma/client';
import { uuidToBinary } from '../utils';

const prisma = new PrismaClient();


export const fileUploadRepo = async (data: any) => {
    try {
        const file = await prisma.file.create({
            data: data,
        });
        return file;
    } catch (error) {
        console.error('Error creating file:', error);
        throw error;
    }
};

export const findFileTypeIdRepo = async (fileTypeId: string): Promise<boolean> => {
    try {
        console.log("here", fileTypeId);
        const fileType = await prisma.fileType.findUnique({
            where: {
                id: uuidToBinary(fileTypeId), 
            },
        });

        return fileType !== null;
    } catch (error) {
        console.error('Error finding file type:', error);
        throw error;
    }
};