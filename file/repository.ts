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

export const imageUploadRepo = async (profile: string, userId: string) => {
    try {
        const file = await prisma.user.update({
            data: {profile: profile}, 
            where: {
                id: uuidToBinary(userId), 
            },
        });
        return file;
    } catch (error) {
        console.error('Error creating file:', error);
        throw error;
    }
};

export const findFileTypeIdRepo = async (fileTypeId: string): Promise<boolean> => {
    try {
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