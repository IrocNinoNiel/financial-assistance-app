import {
  Prisma,
  PrismaClient,
  sponsorship,
  sponsorshipSchool,
} from "@prisma/client";
import { RecordStatus, uuidToBinary } from "../utils";

export const createSponsorshipRepo = async (
  data: Prisma.sponsorshipUncheckedCreateInput,
  prisma: any
): Promise<sponsorship> => {
  return await prisma.sponsorship.create({
    data,
    include: {
      academicYear: {
        select: { academic_year_start: true, academic_year_end: true },
      },
      sponsor: {
        select: { first_name: true, middle_name: true, last_name: true },
      },
      coordinator: {
        select: { first_name: true, middle_name: true, last_name: true },
      },
    },
  });
};

export const createSponsorshipSchoolRepo = async (
  data: Prisma.sponsorshipSchoolUncheckedCreateInput[],
  sponsorshipId: string,
  prisma: any
): Promise<any> => {
  await prisma.sponsorshipSchool.createMany({ data, skipDuplicates: true });
  return prisma.sponsorshipSchool.findMany({
    where: {
      sponsorship_id: uuidToBinary(sponsorshipId),
    },
    include: {
      school: { select: { school_name: true } },
    },
  });
};

export const getAllSponsorshipSchoolRepo = async (
  sponsorshipId: string,
  prisma: any
) => {
  return prisma.sponsorshipSchool.findMany({
    where: {
      sponsorship_id: uuidToBinary(sponsorshipId),
    },
    include: {
      school: { select: { school_name: true } },
    },
  });
};

export const createSponsorshipRequirementRepo = async (
  data: Prisma.sponsorshipRequirementUncheckedCreateInput[],
  sponsorshipId: string,
  prisma: any
): Promise<any> => {
  await prisma.sponsorshipRequirement.createMany({
    data,
    skipDuplicates: true,
  });
  return prisma.sponsorshipRequirement.findMany({
    where: {
      sponsorship_id: uuidToBinary(sponsorshipId),
    },
    include: {
      fileType: { select: { name: true } },
    },
  });
};

export const applyToSponsorshipRepo = async (
  data: Prisma.sponsorshipApplicationUncheckedCreateInput,
  prisma: any
): Promise<any> => {
  await prisma.sponsorshipApplication.create({ data });
  return prisma.sponsorshipApplication.findFirst({
    where: {
      sponsorship_id: data.sponsorship_id,
      student_id: data.student_id,
    },
    include: {
      student: {
        select: { first_name: true, middle_name: true, last_name: true },
      },
      sponsorship: {
        include: {
          requirements: { include: { fileType: { select: { name: true } } } },
        },
      },
    },
  });
};

export const getAllStudentSponsorshipRepo = async (
  studentId: string,
  prisma: any
): Promise<any[]> => {
  return prisma.sponsorshipApplication.findMany({
    where: {
      student_id: uuidToBinary(studentId), // Ensure uuidToBinary returns correct binary format
    },
    include: {
      student: {
        select: {
          first_name: true,
          middle_name: true,
          last_name: true,
          user_id: true,
        },
      },
      sponsorship: {
        include: {
          requirements: { include: { fileType: { select: { name: true } } } },
        },
      },
    },
  });
};

export const getOneStudentSponsorshipRepo = async (
  sponsorshipId: string,
  prisma: any
): Promise<any> => {
  return prisma.sponsorshipApplication.findFirst({
    where: {
      sponsorship_id: uuidToBinary(sponsorshipId), // Ensure uuidToBinary returns correct binary format
    },
    include: {
      student: {
        select: {
          first_name: true,
          middle_name: true,
          last_name: true,
          user_id: true,
        },
      },
      sponsorship: {
        include: {
          requirements: { include: { fileType: { select: { name: true } } } },
        },
      },
    },
  });
};

export const getAllSponsorshipRequirements = async (
  sponsorshipId: string,
  prisma: any
) => {
  return prisma.sponsorshipRequirement.findMany({
    where: {
      sponsorship_id: uuidToBinary(sponsorshipId),
    },
    include: {
      fileType: { select: { name: true } },
    },
  });
};

export const getAllSponsorshipStudent = async (
  sponsorshipId: string,
  prisma: any
) => {
  return prisma.sponsorshipApplication.findMany({
    where: {
      sponsorship_id: uuidToBinary(sponsorshipId),
    },
    include: {
      student: {
        select: {
          first_name: true,
          middle_name: true,
          last_name: true,
          user_id: true,
          id: true,
        },
      },
    },
  });
};

export const getAllSponsorshipRepo = async (
  whereCondition: any,
  prisma: any
): Promise<any> => {
  return await prisma.sponsorship.findMany({
    where: whereCondition,
    include: {
      academicYear: {
        select: { academic_year_start: true, academic_year_end: true },
      },
      sponsor: {
        select: { first_name: true, middle_name: true, last_name: true },
      },
      coordinator: {
        select: { first_name: true, middle_name: true, last_name: true },
      },
      schools: {
        include: { school: { select: { id: true, school_name: true } }}
      },
      requirements: {
        include: { fileType: { select: { id: true, name: true } }}
      },
      sponsorshipApplication: {
        include: { student: {
          include: { files: { select: { file_name: true } } }
        }},
      },
      _count: {
        select: {
          sponsorshipApplication: true,
        },
      },
    },
  });
};

export const getOneSponsorshipRepo = async (
  id: string,
  prisma: any
): Promise<any> => {
  return await prisma.sponsorship.findUnique({
    where: { id: uuidToBinary(id) },
    include: {
      academicYear: {
        select: { academic_year_start: true, academic_year_end: true },
      },
      sponsor: {
        select: { first_name: true, middle_name: true, last_name: true },
      },
      coordinator: {
        select: { first_name: true, middle_name: true, last_name: true },
      },
      _count: {
        select: {
          sponsorshipApplication: true,
        },
      },
    },
  });
};

export const updateSponsorshipRepo = async (
  id: string,
  data: Prisma.sponsorshipUncheckedUpdateInput,
  prisma: any
): Promise<any> => {
  return await prisma.sponsorship.update({
    where: { id: uuidToBinary(id) },
    data,
    include: {
      academicYear: {
        select: { academic_year_start: true, academic_year_end: true },
      },
      sponsor: {
        select: { first_name: true, middle_name: true, last_name: true },
      },
      coordinator: {
        select: { first_name: true, middle_name: true, last_name: true },
      },
    },
  });
};

export const deleteOneSponsorshipRepo = async (id: string, prisma: any) => {
  await prisma.sponsorship.update({
    where: { id: uuidToBinary(id) },
    data: { record_status: RecordStatus.DELETED },
  });
};

export const checkIfSponsorshipExistRepo = async (
  name: string,
  batchNumber: number,
  sponsorshipId: any,
  prisma: any
): Promise<boolean> => {
  const whereCondition: any = {
    name,
    batch_number: batchNumber,
    record_status: RecordStatus.ACTIVE,
  };

  if (sponsorshipId) {
    whereCondition.id = { not: uuidToBinary(sponsorshipId) };
  }

  const data = await prisma.sponsorship.findFirst({
    where: whereCondition,
  });
  return data !== null;
};

export const checkSponsorshipIdRepo = async (
  sponsorshipId: string,
  prisma: any
): Promise<boolean> => {
  const data = await prisma.sponsorship.findFirst({
    where: {
      id: uuidToBinary(sponsorshipId),
      record_status: RecordStatus.ACTIVE,
    },
  });
  return data === null;
};

export const doesStudentAlreadyAppliedRepo = async (
  studentId: string,
  sponsorshipId: string,
  prisma: any
): Promise<boolean> => {
  const data = await prisma.sponsorshipApplication.findFirst({
    where: {
      sponsorship_id: uuidToBinary(sponsorshipId),
      student_id: uuidToBinary(studentId),
    },
  });
  return data !== null;
};

export const deleteAllSponsorshipSchools = async (
  sponsorshipId: string,
  prisma: any
) => {
  await prisma.sponsorshipSchool.deleteMany({
    where: { sponsorship_id: uuidToBinary(sponsorshipId) },
  });
};

export const deleteAllSponsorshipRequirements = async (
  sponsorshipId: string,
  prisma: any
) => {
  await prisma.sponsorshipRequirement.deleteMany({
    where: { sponsorship_id: uuidToBinary(sponsorshipId) },
  });
};
