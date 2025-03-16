import { PrismaClient } from "@prisma/client";
import { uuidToBinary } from "../utils";

const prisma = new PrismaClient({
  log: ["query"],
});

export const fileUploadRepo = async (data: any) => {
  try {
    const file = await prisma.file.create({
      data: data,
    });
    return file;
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
};

export const imageUploadRepo = async (profile: string, userId: string) => {
  try {
    const file = await prisma.user.update({
      data: { profile: profile },
      where: {
        id: uuidToBinary(userId),
      },
    });
    return file;
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
};

export const findFileTypeIdRepo = async (
  fileTypeId: string
): Promise<boolean> => {
  try {
    const fileType = await prisma.fileType.findUnique({
      where: {
        id: uuidToBinary(fileTypeId),
      },
    });

    return fileType !== null;
  } catch (error) {
    console.error("Error finding file type:", error);
    throw error;
  }
};

export const checkIfInvalidFileTypeIdRepo = async (fileTypeIds: Buffer[]) => {
  const validFileTypessCount = await prisma.fileType.count({
    where: {
      id: { in: fileTypeIds },
    },
  });

  return validFileTypessCount !== fileTypeIds.length;
};

export const getAllFileTypeRepo = async () => {
  const data = await prisma.fileType.findMany({});
  return data;
};

export const getAllFileOfStudentRepo = async (
  studentId: string
): Promise<any[]> => {
  return await prisma.file.findMany({
    where: { student_id: uuidToBinary(studentId) },
    select: { student_id: true, file_name: true, fileType: { select: { name: true } } },
  });
};

export const getBulkFileOfStudentsRepo = async (
  studentIds: any[]
): Promise<any[]> => {
  return await prisma.file.findMany({
    where: { student_id: { in: studentIds } },
    select: {
      student_id: true,
      file_name: true,
      fileType: { select: { name: true } },
    },
  });
};
