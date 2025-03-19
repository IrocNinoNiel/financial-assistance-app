import { Prisma, PrismaClient, sponsorship } from "@prisma/client";
import { APPLICATION_STAGE, APPLICATION_STATUS, binaryToUuid, extractUserFromToken, SponsorshipRequest, uuidToBinary } from "../utils";
import { toApplyScholarship, toApplyScholarshipResponse, toSponsorReqModel, toSponsorSchoolModel, toSponsorshipModel, toSponsorshipResponse } from "../utils/converter";
import { checkIfSponsorshipExistRepo, checkSponsorshipIdRepo, createSponsorshipRepo, createSponsorshipRequirementRepo, createSponsorshipSchoolRepo, deleteAllSponsorshipRequirements, deleteAllSponsorshipSchools, getAllSponsorshipRepo, getAllSponsorshipRequirements, getAllSponsorshipSchoolRepo, updateSponsorshipRepo, getOneSponsorshipRepo, deleteOneSponsorshipRepo, applyToSponsorshipRepo, doesStudentAlreadyAppliedRepo, getAllStudentSponsorshipRepo, getOneStudentSponsorshipRepo, getAllSponsorshipStudent, adjustStudentEligibilityStatusRepo } from './repository';
import { ApplySponsorshipRequest, ApplySponsorshipResponse, AuthPayload, GetAllSponsorshipType, RecordStatus, SponsorshipResponse, UpdateStudentStatus, UpdateStudentStatusRequest } from '../utils/types';
import { getStudentCollegeSchoolRepo } from "../student/repository";;
import { getAllFileOfStudent, getBulkFileOfStudents } from "../file/service";
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const createSponsorship = async (payload: SponsorshipRequest, authHeader: any): Promise<SponsorshipResponse> => {
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    
    return await prisma.$transaction(async (prisma) => {
        const data: Prisma.sponsorshipUncheckedCreateInput = toSponsorshipModel(payload, userId);
        const sponsorship: Prisma.sponsorshipUncheckedCreateInput = await createSponsorshipRepo(data, prisma); // Pass `prisma` to use transaction
        const sponsorshipId = binaryToUuid(sponsorship.id);

        // Create Sponsorship School data
        if (payload.sponsorshipSchool?.length) {
            const convertedSponSchool: Prisma.sponsorshipSchoolUncheckedCreateInput[] = toSponsorSchoolModel(payload.sponsorshipSchool, binaryToUuid(sponsorship.id));
            await createSponsorshipSchoolRepo(convertedSponSchool, prisma);
        }

        // Create Sponsorship Requirements data
        if (payload.sponsorshipRequirements?.length) {
            const convertedSponReq: Prisma.sponsorshipRequirementUncheckedCreateInput[] = toSponsorReqModel(payload.sponsorshipRequirements, binaryToUuid(sponsorship.id));
            await createSponsorshipRequirementRepo(convertedSponReq, prisma);
        }

        const sponsorshipData = await getOneSponsorshipRepo( sponsorshipId, prisma );
        return toSponsorshipResponse(sponsorshipData);
    });
};

export const applyToSponsorship = async ( payload: ApplySponsorshipRequest, authHeader: any): Promise<ApplySponsorshipResponse> => { 
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;

    return await prisma.$transaction(async (prisma) => { 
        const apply: Prisma.sponsorshipApplicationUncheckedCreateInput = toApplyScholarship( payload, userId );
        const data: any = await applyToSponsorshipRepo( apply, prisma );
        return toApplyScholarshipResponse( data );
    })
}

export const getAllStudentSponsorship = async ( studentId: string, authHeader: any): Promise<ApplySponsorshipResponse[]> => { 
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    const data: any[] = await getAllStudentSponsorshipRepo( studentId, prisma );
    const studentFiles: any[] = await getAllFileOfStudent( binaryToUuid(data[0].student.user_id) );
    
    return data.map( e => toApplyScholarshipResponse ( e, studentFiles ));

}

export const getOneStudentSponsorship = async ( sponsorshipId: string, authHeader: any): Promise<ApplySponsorshipResponse> => { 
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    const data: any = await getOneStudentSponsorshipRepo( sponsorshipId, prisma);
    const studentFiles: any[] = await getAllFileOfStudent( binaryToUuid(data.student.user_id) );
    
    return toApplyScholarshipResponse ( data, studentFiles );
}

export const updateSponsorship = async ( payload: SponsorshipRequest, authHeader: any, sponsorshipId: string ) : Promise<SponsorshipResponse> => {
    
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;

    return await prisma.$transaction(async (prisma) => {  

        const data: Prisma.sponsorshipUncheckedCreateInput = toSponsorshipModel( payload, userId);
        await updateSponsorshipRepo( sponsorshipId, data, prisma );

        // delete school and requirements inside that sponsor
        await deleteAllSponsorshipSchools( sponsorshipId, prisma );
        await deleteAllSponsorshipRequirements( sponsorshipId, prisma );

        // create SponsorshipSchool data
        if(payload.sponsorshipSchool && payload.sponsorshipSchool.length > 0) {
            const convertedSponSchool: Prisma.sponsorshipSchoolUncheckedCreateInput[] = toSponsorSchoolModel( payload.sponsorshipSchool, sponsorshipId)
            await createSponsorshipSchoolRepo( convertedSponSchool, prisma );
        }

        // create Sponsorship Requirements data
        if(payload.sponsorshipRequirements && payload.sponsorshipRequirements.length > 0) {
            const convertedSponReq: Prisma.sponsorshipRequirementUncheckedCreateInput[] = toSponsorReqModel( payload.sponsorshipRequirements, sponsorshipId )
            await createSponsorshipRequirementRepo( convertedSponReq, prisma )
        }

        const sponsorshipData = await getOneSponsorshipRepo( sponsorshipId, prisma );
        return toSponsorshipResponse( sponsorshipData );
    });
}

export const getAllSponsorship = async ( authHeader: string ): Promise<SponsorshipResponse[]> => {
    
    // check if student or sponsor
    const userDetails: { email: string, userId: string } = extractUserFromToken(authHeader);
    const userId: string = userDetails.userId;

    const whereCondition = {
        coordinator_id: uuidToBinary(userId),
        record_status: RecordStatus.ACTIVE,
      };
      


    const data: GetAllSponsorshipType[] = await getAllSponsorshipRepo( whereCondition, prisma );
    console.log("Get all sponsorship success");

    //get all student files
    const studentIds: string[] = [];
    data.forEach((item: GetAllSponsorshipType) => {
        if (item.sponsorshipApplication) {
            item.sponsorshipApplication.forEach(app => {
                studentIds.push(binaryToUuid(app.student.id));
            });
        }
    });
    
    const bulkFiles = await getBulkFileOfStudents( studentIds );

    const filesByStudent = bulkFiles.reduce((acc, file) => {
        if (!acc[file.student_id]) acc[binaryToUuid(file.student_id)] = [];
        acc[binaryToUuid(file.student_id)].push({ name: file.file_name, fileType: file.fileType.name });
        return acc;
    }, {});


    const result = data.map((item: GetAllSponsorshipType) => {
        if (item.sponsorshipApplication) {
          item.sponsorshipApplication.forEach(app => {
            app.student.files = filesByStudent[binaryToUuid(app.student.id)] || [];
          });
        }
        return toSponsorshipResponse(item);
    });

    return result;
};

export const getAllAvailableSponsorship = async ( studentId: string ): Promise<SponsorshipResponse[]> => {
    
    let whereCondition: any = {};

    const studentCollegeSchoolID = await getStudentCollegeSchoolRepo( studentId );

    if (!studentCollegeSchoolID || studentCollegeSchoolID === null) {
        return [];
    }

    whereCondition = {
        record_status: RecordStatus.ACTIVE,
        schools: {
            some: {
                school_id: {
                equals: uuidToBinary(studentCollegeSchoolID),
                }
            }
        }
    };
    
    const data = await getAllSponsorshipRepo( whereCondition, prisma );
    return data.map( item =>  toSponsorshipResponse(item));
};

export const getOneSponsorship = async ( sponsorshipId: string): Promise<SponsorshipResponse> => {
    const data:GetAllSponsorshipType = await getOneSponsorshipRepo( sponsorshipId, prisma );

    //get all student files
    const studentIds = [];
    if (data.sponsorshipApplication) {
        data.sponsorshipApplication.forEach(app => {
            studentIds.push(binaryToUuid(app.student.id));
        });
    }
    
    const bulkFiles = await getBulkFileOfStudents( studentIds );

    const filesByStudent = bulkFiles.reduce((acc, file) => {
        if (!acc[file.student_id]) acc[binaryToUuid(file.student_id)] = [];
        acc[binaryToUuid(file.student_id)].push({ name: file.file_name, fileType: file.fileType.name });
        return acc;
    }, {});


    if (data.sponsorshipApplication) {
        data.sponsorshipApplication.forEach(app => {
          app.student.files = filesByStudent[binaryToUuid(app.student.id)] || [];
        });
    }
    
    return toSponsorshipResponse(data);
};


export const adjustStudentEligibilityStatus = async (studentId: string, details: UpdateStudentStatusRequest) => {


    const converted: UpdateStudentStatus = { student_id: "1", sponsorship_id: "1", application_stage: APPLICATION_STAGE.FINAL_SELECTION, application_status: APPLICATION_STATUS.APPROVED};
    await adjustStudentEligibilityStatusRepo(converted, prisma);
}

export const deleteOneSponsorship = async ( sponsorshipId: string) => {
    await deleteOneSponsorshipRepo ( sponsorshipId, prisma );
}

export const checkIfSponsorshipExist = async ( name: string, batchNumber: number, sponsorshipId: any ): Promise<boolean> => {
    return await checkIfSponsorshipExistRepo( name, batchNumber, sponsorshipId, prisma );
}

export const checkSponsorshipId = async ( sponsorshipId: string ): Promise<boolean> => {
    return await checkSponsorshipIdRepo( sponsorshipId, prisma );
}

export const doesStudentAlreadyApplied = async ( studentId: string, sponsorshipId: string ): Promise<boolean> => {
    return await doesStudentAlreadyAppliedRepo( studentId, sponsorshipId, prisma );
}