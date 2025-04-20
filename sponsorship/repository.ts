import {
  criterionCategory,
  criterionRequiredColumn,
  customInputCriterion,
  Prisma,
  PrismaClient,
  sponsorship,
  sponsorshipCriteriaPairwise,
  sponsorshipCriterion,
  sponsorshipSchool,
} from "@prisma/client";
import { binaryToUuid, CriterionCategoryWithCriterion, GetAllSponsorshipType, QueryParams, RecordStatus, SponsorshipCriteriaPairwise, SponsorshipCriterionModel, UpdateStudentStatus, UpdateStudentStatusRequest, uuidToBinary } from "../utils";

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
  prisma: any,
  params: QueryParams
): Promise<GetAllSponsorshipType[]> => {

  let orderBy: any = {};
  if (params.sort) {
    orderBy['created_at'] = params.sort === 'desc' ? 'desc' : 'asc';
  }

  if (params.search && params.search != "") {
    whereCondition.name = {
      contains: params.search
    };
  }

  return await prisma.sponsorship.findMany({
    where: whereCondition,
    skip: params.offset,
    take: params.limit,
    orderBy,
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

export const adjustStudentEligibilityStatusRepo = async (details: UpdateStudentStatus, appId: string, prisma: any) => {
  return await prisma.sponsorshipApplication.update({
    data: details,
    where: {
      id: uuidToBinary(appId)
    }
  })
}

export const findAppId = async ( prisma: any, studentId: string, sponsorshipId: string ) => {
  const app = await prisma.sponsorshipApplication.findFirst({
    where: {
      student_id: uuidToBinary(studentId),
      sponsorship_id: uuidToBinary(sponsorshipId)
    },
    select: { id: true } // Get only the primary key
  });
  
  if (!app) {
    throw new Error("Application not found");
  }

  return app;
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


export const checkBatchRepo = async (
  batchNo: number,
  sponsorshipId: string,
  prisma: PrismaClient
) => {
  const result = await prisma.sponsorship.findFirst({
    where: { id: uuidToBinary(sponsorshipId), batch_number: batchNo, record_status: RecordStatus.ACTIVE },
  });

  return !!result;
};

export const getCategoryCriterionRepo = async ( prisma: PrismaClient ) : Promise<CriterionCategoryWithCriterion[]> => {
  return await prisma.criterionCategory.findMany(
    { 
      select: { id: true, name: true, criterion: { select: { id: true, name: true}}},
      where: {record_status: RecordStatus.ACTIVE}
    } 
  );
}

export const checkCriterionCategoryIdRepo = async (
  criterionCategoryId: string,
  prisma: PrismaClient
): Promise<boolean> => {
  const data = await prisma.criterionCategory.findFirst({
    where: {
      id: uuidToBinary(criterionCategoryId),
      record_status: RecordStatus.ACTIVE,
    },
  });
  return data === null;
};

export const createSponsorshipCriterionRepo = async (
  convertedData: Prisma.sponsorshipCriterionUncheckedCreateInput,
  prisma: PrismaClient
): Promise<sponsorshipCriterion> => {

  return await prisma.sponsorshipCriterion.create({
    data: convertedData
  });
}
export const getAllSponsorshipCriterionRepo = async ( sponsorshipId: string, prisma: PrismaClient ): Promise<sponsorshipCriterion[]> => {
  return await prisma.sponsorshipCriterion.findMany(
    { where: 
      { sponsorship_id: uuidToBinary( sponsorshipId), 
        record_status: RecordStatus.ACTIVE
      }
    });
}

export const createManyRequiredColumnRepo = async (
  data: Prisma.criterionRequiredColumnUncheckedCreateInput[],
  prisma: PrismaClient
): Promise<void> => {
  await prisma.criterionRequiredColumn.createMany({ data: data });
}

export const saveBulkPairwiseCriteriaRepo = async (
  data: Prisma.sponsorshipCriteriaPairwiseUncheckedCreateInput[],
  prisma: PrismaClient
): Promise<void> => {
  await prisma.sponsorshipCriteriaPairwise.createMany({data});
}

export const deleteManySponsorshipCriterionRepo = async (
  ids: string[],
  prisma: PrismaClient
): Promise<void> => {
  await prisma.sponsorshipCriterion.updateMany({
    where: { id: { in: ids.map(uuidToBinary) }, },
    data: { record_status: RecordStatus.DELETED },
  });
}

export const updateSponsorshipCriterionRepo = async (
  convertedData: Prisma.sponsorshipCriterionUncheckedCreateInput,
  id: string,
  prisma: PrismaClient
): Promise<sponsorshipCriterion> => {

  return await prisma.sponsorshipCriterion.update({
    where: { id: uuidToBinary(id)},
    data: convertedData
  });
}

export const getAllRequiredColumnRepo = async ( 
  sponCritId: string, prisma: PrismaClient
): Promise<criterionRequiredColumn[]> => {
  return await prisma.criterionRequiredColumn.findMany({
    where: {sponsorship_criterion_id: uuidToBinary( sponCritId ), record_status: RecordStatus.ACTIVE}
  })
}

export const updateRequiredColumnRepo = async (
  data: Prisma.criterionRequiredColumnUncheckedCreateInput,
  id: string,
  prisma: PrismaClient
): Promise<void> => {
  await prisma.criterionRequiredColumn.update({ where: { id: uuidToBinary(id)},data: data });
}

export const deleteManyRequiredColumnRepo = async( 
  ids: string[],
  prisma: PrismaClient
): Promise<void> => {
  await prisma.criterionRequiredColumn.updateMany({ where: {id: { in: ids.map(uuidToBinary) },}, data: {record_status: RecordStatus.DELETED}});
}

export const getAllCriterionPairwiseRepo = async (sponsorshipId: string, prisma: PrismaClient): Promise<sponsorshipCriteriaPairwise[]> => {
  return await prisma.sponsorshipCriteriaPairwise.findMany({ where: { sponsorship_id: uuidToBinary(sponsorshipId),record_status: RecordStatus.ACTIVE}})
}

export const updatePairwiseCriteriaRepo = async (
  data: Prisma.sponsorshipCriteriaPairwiseUncheckedCreateInput,
  id: string,
  prisma: PrismaClient
): Promise<void> => {
  await prisma.sponsorshipCriteriaPairwise.update({ where: {id: uuidToBinary(id)}, data: data});
}

export const deleteManySponsorshipPairwiseCriterion = async( 
  ids: string[],
  prisma: PrismaClient
): Promise<void> => {
  await prisma.sponsorshipCriteriaPairwise.updateMany({ where: {id: { in: ids.map(uuidToBinary) },}, data: {record_status: RecordStatus.DELETED}});
}

export const getSponsorshipCriterionRepo = async ( sponsorshipId: string, prisma: PrismaClient ): Promise<SponsorshipCriterionModel[]> => {
  return await prisma.sponsorshipCriterion.findMany({
    where: {
      sponsorship_id: uuidToBinary(sponsorshipId),
      record_status: RecordStatus.ACTIVE
    },
    select: {
      id: true,
      sponsorship_id: true,
      criterion_category_id: true,
      name: true,
      label: true,
      data_source: true,
      formula_type: true,
      preference: true,
      requiredColumn: {
        select: {
          id: true,
          sponsorship_criterion_id: true,
          table: true,
          column: true,
        },
        where: {
          record_status: RecordStatus.ACTIVE
        }
      }
    }
  });
}

export const getAllSponsorshipCriterionPairwiseRepo = async( sponsorshipId: string, prisma: PrismaClient ): Promise<SponsorshipCriteriaPairwise[]> => {
  return await prisma.sponsorshipCriteriaPairwise.findMany({
    where: {
      sponsorship_id: uuidToBinary(sponsorshipId),
      record_status: RecordStatus.ACTIVE
    },
    select: {
      id: true,
      sponsorship_id: true,
      sponsorship_criterion_id_a: true,
      sponsorship_criterion_name_a: true,
      sponsorship_criterion_id_b: true,
      sponsorship_criterion_name_b: true, 
      value: true
    }
  });
}

export const createBulkCustomInput = async ( data: Prisma.customInputCriterionUncheckedCreateInput[],prisma: PrismaClient ): Promise<void> => {
  await prisma.customInputCriterion.createMany({ data })
}

export const updateCustomInput = async ( 
  data: Prisma.customInputCriterionUncheckedCreateInput,
  studentId: string,
  sponsorshipCriterionId: string,
  sponsorshipId: string,
  prisma: PrismaClient,
): Promise<void> => {
  await prisma.customInputCriterion.update({ data: data, 
    where: {
      student_id_sponsorship_criterion_id_sponsorship_id: {
        student_id: uuidToBinary(studentId),
        sponsorship_criterion_id: uuidToBinary(sponsorshipCriterionId),
        sponsorship_id: uuidToBinary(sponsorshipId)
      }
    } 
  })
}