import { EvaluationStatus, Prisma, PrismaClient, sponsorship } from "@prisma/client";
import {
  APPLICATION_STAGE,
  APPLICATION_STATUS,
  binaryToUuid,
  extractUserFromToken,
  SponsorshipRequest,
  uuidToBinary,
} from "../utils";
import {
  toApplyScholarship,
  toApplyScholarshipResponse,
  toSponsorReqModel,
  toSponsorSchoolModel,
  toSponsorshipModel,
  toSponsorshipResponse,
  toUpdateStatusModel,
  toUpdateStatusResponse,
} from "../utils/converter";
import {
  checkIfSponsorshipExistRepo,
  checkSponsorshipIdRepo,
  createSponsorshipRepo,
  createSponsorshipRequirementRepo,
  createSponsorshipSchoolRepo,
  deleteAllSponsorshipRequirements,
  deleteAllSponsorshipSchools,
  getAllSponsorshipRepo,
  getAllSponsorshipRequirements,
  getAllSponsorshipSchoolRepo,
  updateSponsorshipRepo,
  getOneSponsorshipRepo,
  deleteOneSponsorshipRepo,
  applyToSponsorshipRepo,
  doesStudentAlreadyAppliedRepo,
  getAllStudentSponsorshipRepo,
  getOneStudentSponsorshipRepo,
  getAllSponsorshipStudent,
  adjustStudentEligibilityStatusRepo,
  generateAppIdRepo,
  findAppId,
  checkBatchRepo,
} from "./repository";
import {
  ApplySponsorshipRequest,
  ApplySponsorshipResponse,
  AuthPayload,
  GetAllSponsorshipType,
  QueryParams,
  RecordStatus,
  SponsorshipResponse,
  UpdateStudentStatus,
  UpdateStudentStatusRequest,
} from "../utils/types";
import { getStudentCollegeSchoolRepo } from "../student/repository";
import { getAllFileOfStudent, getBulkFileOfStudents } from "../file/service";
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const progressionMap = {
  [APPLICATION_STAGE.POOLING]: {
    COMPLETE: {
      nextStage: APPLICATION_STAGE.APPLICATION_LIST,
      nextStatus: APPLICATION_STATUS.PENDING_APPLICATION_LIST,
    },
  },
  [APPLICATION_STAGE.APPLICATION_LIST]: {
    COMPLETE: {
      nextStage: APPLICATION_STAGE.RANKING_SELECTION,
      nextStatus: APPLICATION_STATUS.PENDING_RANKING_SELECTION,
    },
  },
  [APPLICATION_STAGE.RANKING_SELECTION]: {
    RANKED: {
      nextStage: APPLICATION_STAGE.FINAL_SELECTION,
      nextStatus: APPLICATION_STATUS.PENDING_FINAL_SELECTION,
    },
  },
};

export const createSponsorship = async (
  payload: SponsorshipRequest,
  authHeader: any
): Promise<SponsorshipResponse> => {
  const userDetails = extractUserFromToken(authHeader);
  const userId = userDetails.userId;

  return await prisma.$transaction(async (prisma) => {
    const data: Prisma.sponsorshipUncheckedCreateInput = toSponsorshipModel(
      payload,
      userId
    );
    const sponsorship: Prisma.sponsorshipUncheckedCreateInput =
      await createSponsorshipRepo(data, prisma); // Pass `prisma` to use transaction
    const sponsorshipId = binaryToUuid(sponsorship.id);

    // Create Sponsorship School data
    if (payload.sponsorshipSchool?.length) {
      const convertedSponSchool: Prisma.sponsorshipSchoolUncheckedCreateInput[] =
        toSponsorSchoolModel(
          payload.sponsorshipSchool,
          binaryToUuid(sponsorship.id)
        );
      await createSponsorshipSchoolRepo(convertedSponSchool, prisma);
    }

    // Create Sponsorship Requirements data
    if (payload.sponsorshipRequirements?.length) {
      const convertedSponReq: Prisma.sponsorshipRequirementUncheckedCreateInput[] =
        toSponsorReqModel(
          payload.sponsorshipRequirements,
          binaryToUuid(sponsorship.id)
        );
      await createSponsorshipRequirementRepo(convertedSponReq, prisma);
    }

    const sponsorshipData = await getOneSponsorshipRepo(sponsorshipId, prisma);
    return toSponsorshipResponse(sponsorshipData);
  });
};

export const applyToSponsorship = async (
  payload: ApplySponsorshipRequest,
  authHeader: any
): Promise<ApplySponsorshipResponse> => {
  const userDetails = extractUserFromToken(authHeader);
  const userId = userDetails.userId;

  return await prisma.$transaction(async (prisma) => {
    const appId = await generateAppId( payload.sponsorshipId );
    const apply: Prisma.sponsorshipApplicationUncheckedCreateInput =
      toApplyScholarship(payload, appId, userId);
    const data: any = await applyToSponsorshipRepo(apply, prisma);
    return toApplyScholarshipResponse(data);
  });
};

export const getAllStudentSponsorship = async (
  studentId: string,
  authHeader: any
): Promise<ApplySponsorshipResponse[]> => {
  const userDetails = extractUserFromToken(authHeader);
  const userId = userDetails.userId;
  const data: any[] = await getAllStudentSponsorshipRepo(studentId, prisma);
  const studentFiles: any[] = await getAllFileOfStudent(
    binaryToUuid(data[0].student.user_id)
  );

  console.log("data", data);

  return data.map((e) => toApplyScholarshipResponse(e, studentFiles));
};

export const getOneStudentSponsorship = async (
  sponsorshipId: string,
  authHeader: any
): Promise<ApplySponsorshipResponse> => {
  const userDetails = extractUserFromToken(authHeader);
  const userId = userDetails.userId;
  const data: any = await getOneStudentSponsorshipRepo(sponsorshipId, prisma);
  const studentFiles: any[] = await getAllFileOfStudent(
    binaryToUuid(data.student.user_id)
  );

  return toApplyScholarshipResponse(data, studentFiles);
};

export const updateSponsorship = async (
  payload: SponsorshipRequest,
  authHeader: any,
  sponsorshipId: string
): Promise<SponsorshipResponse> => {
  const userDetails = extractUserFromToken(authHeader);
  const userId = userDetails.userId;

  return await prisma.$transaction(async (prisma) => {
    const data: Prisma.sponsorshipUncheckedCreateInput = toSponsorshipModel(
      payload,
      userId
    );
    await updateSponsorshipRepo(sponsorshipId, data, prisma);

    // delete school and requirements inside that sponsor
    await deleteAllSponsorshipSchools(sponsorshipId, prisma);
    await deleteAllSponsorshipRequirements(sponsorshipId, prisma);

    // create SponsorshipSchool data
    if (payload.sponsorshipSchool && payload.sponsorshipSchool.length > 0) {
      const convertedSponSchool: Prisma.sponsorshipSchoolUncheckedCreateInput[] =
        toSponsorSchoolModel(payload.sponsorshipSchool, sponsorshipId);
      await createSponsorshipSchoolRepo(convertedSponSchool, prisma);
    }

    // create Sponsorship Requirements data
    if (
      payload.sponsorshipRequirements &&
      payload.sponsorshipRequirements.length > 0
    ) {
      const convertedSponReq: Prisma.sponsorshipRequirementUncheckedCreateInput[] =
        toSponsorReqModel(payload.sponsorshipRequirements, sponsorshipId);
      await createSponsorshipRequirementRepo(convertedSponReq, prisma);
    }

    const sponsorshipData = await getOneSponsorshipRepo(sponsorshipId, prisma);
    return toSponsorshipResponse(sponsorshipData);
  });
};

export const getAllSponsorship = async (
  authHeader: string,
  params: QueryParams
): Promise<SponsorshipResponse[]> => {
  // check if student or sponsor
  const userDetails: { email: string; userId: string } =
    extractUserFromToken(authHeader);
  const userId: string = userDetails.userId;

  const whereCondition = {
    coordinator_id: uuidToBinary(userId),
    record_status: RecordStatus.ACTIVE,
  };

  const data: GetAllSponsorshipType[] = await getAllSponsorshipRepo(
    whereCondition,
    prisma,
    params
  );
  console.log("Get all sponsorship success");

  //get all student files
  const studentIds: string[] = [];
  data.forEach((item: GetAllSponsorshipType) => {
    if (item.sponsorshipApplication) {
      item.sponsorshipApplication.forEach((app) => {
        studentIds.push(binaryToUuid(app.student.id));
      });
    }
  });

  const bulkFiles = await getBulkFileOfStudents(studentIds);

  const filesByStudent = bulkFiles.reduce((acc, file) => {
    if (!acc[file.student_id]) acc[binaryToUuid(file.student_id)] = [];
    acc[binaryToUuid(file.student_id)].push({
      name: file.file_name,
      fileType: file.fileType.name,
    });
    return acc;
  }, {});

  const result = data.map((item: GetAllSponsorshipType) => {
    if (item.sponsorshipApplication) {
      item.sponsorshipApplication.forEach((app) => {
        app.student.files = filesByStudent[binaryToUuid(app.student.id)] || [];
      });
    }
    return toSponsorshipResponse(item);
  });

  return result;
};

export const getAllAvailableSponsorship = async (
  studentId: string,
  params: QueryParams
): Promise<SponsorshipResponse[]> => {
  let whereCondition: any = {};

  const studentCollegeSchoolID = await getStudentCollegeSchoolRepo(studentId);

  if (!studentCollegeSchoolID || studentCollegeSchoolID === null) {
    return [];
  }

  whereCondition = {
    record_status: RecordStatus.ACTIVE,
    schools: {
      some: {
        school_id: {
          equals: uuidToBinary(studentCollegeSchoolID),
        },
      },
    },
  };

  const data = await getAllSponsorshipRepo(whereCondition, prisma, params);
  return data.map((item) => toSponsorshipResponse(item));
};

export const getOneSponsorship = async (
  sponsorshipId: string
): Promise<SponsorshipResponse> => {
  const data: GetAllSponsorshipType = await getOneSponsorshipRepo(
    sponsorshipId,
    prisma
  );

  //get all student files
  const studentIds = [];
  if (data.sponsorshipApplication) {
    data.sponsorshipApplication.forEach((app) => {
      studentIds.push(binaryToUuid(app.student.id));
    });
  }

  const bulkFiles = await getBulkFileOfStudents(studentIds);

  const filesByStudent = bulkFiles.reduce((acc, file) => {
    if (!acc[file.student_id]) acc[binaryToUuid(file.student_id)] = [];
    acc[binaryToUuid(file.student_id)].push({
      name: file.file_name,
      fileType: file.fileType.name,
    });
    return acc;
  }, {});

  if (data.sponsorshipApplication) {
    data.sponsorshipApplication.forEach((app) => {
      app.student.files = filesByStudent[binaryToUuid(app.student.id)] || [];
    });
  }

  return toSponsorshipResponse(data);
};

export const adjustStudentEligibilityStatus = async (
  studentId: string,
  details: UpdateStudentStatusRequest,
  authHeader: string
) => {

  const userDetails = extractUserFromToken(authHeader);
  const userId = userDetails.userId;

  const next = progressionMap[details.appStage]?.[details.appStatus];
  if (next) {
    details.appStage = next.nextStage;
    details.appStatus = next.nextStatus;
  }

  return await prisma.$transaction(async (prisma) => { 
    const app = await findAppId(prisma, studentId, details.sponsorshipId);
    const converted: UpdateStudentStatus = toUpdateStatusModel( details, studentId, userId);
    await adjustStudentEligibilityStatusRepo(converted, binaryToUuid(app.id), prisma);

    const response = toUpdateStatusResponse( converted );
    return response;
  });
};

export const deleteOneSponsorship = async (sponsorshipId: string) => {
  await deleteOneSponsorshipRepo(sponsorshipId, prisma);
};

export const checkIfSponsorshipExist = async (
  name: string,
  batchNumber: number,
  sponsorshipId: any
): Promise<boolean> => {
  return await checkIfSponsorshipExistRepo(
    name,
    batchNumber,
    sponsorshipId,
    prisma
  );
};

export const checkSponsorshipId = async (
  sponsorshipId: string
): Promise<boolean> => {
  return await checkSponsorshipIdRepo(sponsorshipId, prisma);
};

export const doesStudentAlreadyApplied = async (
  studentId: string,
  sponsorshipId: string
): Promise<boolean> => {
  return await doesStudentAlreadyAppliedRepo(studentId, sponsorshipId, prisma);
};

export const checkBatch = async ( batchNo: number, sponsorshipId: string ): Promise<boolean> => {
  return await checkBatchRepo( batchNo, sponsorshipId, prisma );
}

async function generateAppId(sponsorshipId: string) {
    const currentYear = new Date().getFullYear();
    const count: number = await generateAppIdRepo(sponsorshipId, prisma);
    const nextNumber = count + 1;

    // Pad the number with leading zeros
    const paddedNumber = String(nextNumber).padStart(5, "0");

    // Formulate app_id
    const appId = `${currentYear}-${paddedNumber}`;

    return appId;
}
