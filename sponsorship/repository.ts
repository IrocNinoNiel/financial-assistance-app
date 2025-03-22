import {
  Prisma,
  PrismaClient,
  sponsorship,
  sponsorshipSchool,
} from "@prisma/client";
import { GetAllSponsorshipType, RecordStatus, UpdateStudentStatus, UpdateStudentStatusRequest, uuidToBinary } from "../utils";

export const createSponsorshipRepo = async (
  data: Prisma.sponsorshipUncheckedCreateInput,
  prisma: any
): Promise<Prisma.sponsorshipUncheckedCreateInput> => {
  return await prisma.sponsorship.create({
    data
  });
};

export const createSponsorshipSchoolRepo = async (
  data: Prisma.sponsorshipSchoolUncheckedCreateInput[],
  prisma: any
): Promise<void> => {
  await prisma.sponsorshipSchool.createMany({ data, skipDuplicates: true });
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
  prisma: any
): Promise<void> => {
  await prisma.sponsorshipRequirement.createMany({
    data,
    skipDuplicates: true,
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
          sex: true, 
          college_program_name: true, 
          college_year_level: true,
          current_citynum:{
            select: {
              citymun_desc: true
            }
          }

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
): Promise<GetAllSponsorshipType[]> => {
  return await prisma.sponsorship.findMany({
    where: whereCondition,
    include: {
      _count: { select: { sponsorshipApplication: true } },
      academicYear: {
        select: { academic_year_start: true, academic_year_end: true }
      },
      sponsor: {
        select: { id: true, first_name: true, middle_name: true, last_name: true }
      },
      coordinator: {
        select: { id: true, first_name: true, middle_name: true, last_name: true }
      },
      schools: {
        include: {
          school: { select: { id: true, school_name: true } }
        }
      },
      requirements: {
        include: {
          fileType: { select: { id: true, name: true } }
        }
      },
      sponsorshipApplication: {
        include: {
          student: {
            select: {
              id: true,
              first_name: true,
              middle_name: true,
              last_name: true,
              user_id: true
            }
          }
        }
      }
    }
  });
};

export const getOneSponsorshipRepo = async (
  id: string,
  prisma: any
): Promise<GetAllSponsorshipType> => {
  return await prisma.sponsorship.findUnique({
    where: { id: uuidToBinary(id) },
    include: {
      _count: { select: { sponsorshipApplication: true } },
      academicYear: {
        select: { academic_year_start: true, academic_year_end: true }
      },
      sponsor: {
        select: { id: true, first_name: true, middle_name: true, last_name: true }
      },
      coordinator: {
        select: { id: true, first_name: true, middle_name: true, last_name: true }
      },
      schools: {
        include: {
          school: { select: { id: true, school_name: true } }
        }
      },
      requirements: {
        include: {
          fileType: { select: { id: true, name: true } }
        }
      },
      sponsorshipApplication: {
        include: {
          student: {
            select: {
              id: true,
              first_name: true,
              middle_name: true,
              last_name: true,
              user_id: true
            }
          }
        }
      }
    }
  });
};

export const updateSponsorshipRepo = async (
  id: string,
  data: Prisma.sponsorshipUncheckedUpdateInput,
  prisma: any
): Promise<void> => {
  return await prisma.sponsorship.update({
    where: { id: uuidToBinary(id) },
    data
  });
};

export const adjustStudentEligibilityStatusRepo = async (details: UpdateStudentStatus, prisma: any) => {
  return await prisma.sponsorshipApplication.update({
    data: {
      application_stage: details.application_stage,
      application_status: details.application_status
    },
    where: {
      student_id: uuidToBinary(details.student_id),
      sponsorship_id: uuidToBinary(details.sponsorship_id) 
    }
  })
}


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

export const generateAppIdRepo = async ( sponsorshipId: string, prisma: any ): Promise<number> => {
  const count = await prisma.sponsorshipApplication.count({
    where: {
      sponsorship_id: uuidToBinary(sponsorshipId)
    },
  }); 

  return count;
}

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
