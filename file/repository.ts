import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const fileUploadRepo = async ( studentId: number, fileName: string ) => {
    try {
        // await prisma.students.update({
        //     where: { id: studentId },
        //     data: { application_form: fileName },
        // });
    } catch (error) {
        console.error('Error updating application form:', error);
        throw error;
    }
};

export const findStudent = async ( userId: number ): Promise<number> => {
    try {
        const studentId = await prisma.students.findFirst({
            where: {user_id: userId},
            select: { id: true }
        })

        return studentId?.id;
    } catch (error) {
        console.error('Error updating application form:', error);
        throw error;
    }
}
