import { Prisma, sponsorship, sponsorshipApplication } from "@prisma/client";
import { binaryToUuid, extractUserFromToken, SponsorshipRequest, uuidToBinary } from "../utils";
import { toApplyScholarship, toApplyScholarshipResponse, toSponsorReqModel, toSponsorSchoolModel, toSponsorshipModel, toSponsorshipResponse } from "../utils/converter";
import { checkIfSponsorshipExistRepo, checkSponsorshipIdRepo, createSponsorshipRepo, createSponsorshipRequirementRepo, createSponsorshipSchoolRepo, deleteAllSponsorshipRequirements, deleteAllSponsorshipSchools, getAllSponsorshipRepo, getAllSponsorshipRequirements, getAllSponsorshipSchoolRepo, updateSponsorshipRepo, getOneSponsorshipRepo, deleteOneSponsorshipRepo, applyToSponsorshipRepo, doesStudentAlreadyAppliedRepo, getAllStudentSponsorshipRepo, getOneStudentSponsorshipRepo } from './repository';
import { ApplySponsorshipRequest, ApplySponsorshipResponse, RecordStatus, SponsorshipResponse } from '../utils/types';
import { checkIfNotSponsor } from "../user/service";
import { checkIfStudentRepo, getOneStudentRepo } from "../student/repository";
import { checkIfNotSponsorRepo } from "../user/repository";
import { getOneStudent } from "../student/service";
import { getAllFileOfUser } from "../file/service";


export const createSponsorship = async ( payload: SponsorshipRequest, authHeader: any ): Promise<SponsorshipResponse> => {
    
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    const data: Prisma.sponsorshipUncheckedCreateInput = toSponsorshipModel( payload, userId);
    const sponsorship: sponsorship = await createSponsorshipRepo( data );

    let schools: string[];
    let requirements: string[];

    // create SponsorshipSchool data
    if(payload.sponsorshipSchool && payload.sponsorshipSchool.length > 0) {
        const convertedSponSchool: Prisma.sponsorshipSchoolUncheckedCreateInput[] = toSponsorSchoolModel( payload.sponsorshipSchool, binaryToUuid(sponsorship.id))
        schools = await createSponsorshipSchoolRepo( convertedSponSchool, binaryToUuid(sponsorship.id) );
    }

    // create Sponsorship Requirements data
    if(payload.sponsorshipRequirements && payload.sponsorshipRequirements.length > 0) {
        const convertedSponReq: Prisma.sponsorshipRequirementUncheckedCreateInput[] = toSponsorReqModel( payload.sponsorshipRequirements, binaryToUuid(sponsorship.id))
        requirements = await createSponsorshipRequirementRepo( convertedSponReq, binaryToUuid(sponsorship.id) )
    }

    return toSponsorshipResponse( sponsorship, schools, requirements );
}

export const applyToSponsorship = async ( payload: ApplySponsorshipRequest, authHeader: any): Promise<ApplySponsorshipResponse> => { 
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;

    const apply: Prisma.sponsorshipApplicationUncheckedCreateInput = toApplyScholarship( payload, userId );
    const data: any = await applyToSponsorshipRepo( apply );
    return toApplyScholarshipResponse( data );
}

export const getAllStudentSponsorship = async ( studentId: string, authHeader: any): Promise<ApplySponsorshipResponse[]> => { 
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    const data: any[] = await getAllStudentSponsorshipRepo( studentId );
    const studentFiles: any[] = await getAllFileOfUser( binaryToUuid(data[0].student.user_id) );
    
    return data.map( e => toApplyScholarshipResponse ( e, studentFiles ));

}

export const getOneStudentSponsorship = async ( sponsorshipId: string, authHeader: any): Promise<ApplySponsorshipResponse> => { 
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    const data: any = await getOneStudentSponsorshipRepo( sponsorshipId );
    const studentFiles: any[] = await getAllFileOfUser( binaryToUuid(data.student.user_id) );
    
    return toApplyScholarshipResponse ( data, studentFiles );
}


export const updateSponsorship = async ( payload: SponsorshipRequest, authHeader: any, sponsorshipId: string ) : Promise<SponsorshipResponse> => {
    
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    const data: Prisma.sponsorshipUncheckedCreateInput = toSponsorshipModel( payload, userId);
    const sponsorship: sponsorship = await updateSponsorshipRepo( sponsorshipId, data );

    let schools: string[];
    let requirements: string[];

    // delete school and requirements inside that sponsor
    await deleteAllSponsorshipSchools( sponsorshipId );
    await deleteAllSponsorshipRequirements( sponsorshipId );

    // create SponsorshipSchool data
    if(payload.sponsorshipSchool && payload.sponsorshipSchool.length > 0) {
        const convertedSponSchool: Prisma.sponsorshipSchoolUncheckedCreateInput[] = toSponsorSchoolModel( payload.sponsorshipSchool, binaryToUuid(sponsorship.id))
        schools = await createSponsorshipSchoolRepo( convertedSponSchool, sponsorshipId );
    }

    // create Sponsorship Requirements data
    if(payload.sponsorshipRequirements && payload.sponsorshipRequirements.length > 0) {
        const convertedSponReq: Prisma.sponsorshipRequirementUncheckedCreateInput[] = toSponsorReqModel( payload.sponsorshipRequirements, binaryToUuid(sponsorship.id))
        requirements = await createSponsorshipRequirementRepo( convertedSponReq, sponsorshipId )
    }

    return toSponsorshipResponse( sponsorship, schools, requirements );
}

export const getAllSponsorship = async ( authHeader: any ): Promise<SponsorshipResponse[]> => {
    
    // check if student or sponsor
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    let whereCondition: any = {};

    whereCondition.coordinator_id = uuidToBinary( userId );
    whereCondition.record_status =  RecordStatus.ACTIVE

    const data = await getAllSponsorshipRepo( whereCondition );

    return Promise.all(
        data.map(async (item) => {
            const sponsorshipId = binaryToUuid(item.id);
            const schools = await getAllSponsorshipSchoolRepo(sponsorshipId);
            const requirements = await getAllSponsorshipRequirements(sponsorshipId);
            return toSponsorshipResponse(item, schools, requirements);
        })
    );
};

export const getAllAvailableSponsorship = async ( authHeader: any ): Promise<SponsorshipResponse[]> => {
    
    // check if student or sponsor
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    let whereCondition: any = {};

    const student = await getOneStudentRepo( userId );

    if (!student || student.college_school_id === null) {
        return [];
    }

    whereCondition = {
        record_status: RecordStatus.ACTIVE,
        schools: {
            some: {
                school_id: {
                equals: student.college_school_id,
                }
            }
        }
    };
    
    const data = await getAllSponsorshipRepo( whereCondition );

    return Promise.all(
        data.map(async (item) => {
            const sponsorshipId = binaryToUuid(item.id);
            const schools = await getAllSponsorshipSchoolRepo(sponsorshipId);
            const requirements = await getAllSponsorshipRequirements(sponsorshipId);
            return toSponsorshipResponse(item, schools, requirements);
        })
    );
};



export const getOneSponsorship = async ( sponsorshipId: string): Promise<SponsorshipResponse> => {
    const data = await getOneSponsorshipRepo( sponsorshipId );

    const schools = await getAllSponsorshipSchoolRepo(sponsorshipId);
    const requirements = await getAllSponsorshipRequirements(sponsorshipId);
    return toSponsorshipResponse(data, schools, requirements);
};

export const deleteOneSponsorship = async ( sponsorshipId: string) => {
    await deleteOneSponsorshipRepo ( sponsorshipId );
}

export const checkIfSponsorshipExist = async ( name: string, batchNumber: number, sponsorshipId: any ): Promise<boolean> => {
    return await checkIfSponsorshipExistRepo( name, batchNumber, sponsorshipId );
}

export const checkSponsorshipId = async ( sponsorshipId: string ): Promise<boolean> => {
    return await checkSponsorshipIdRepo( sponsorshipId );
}

export const doesStudentAlreadyApplied = async ( studentId: string, sponsorshipId: string ): Promise<boolean> => {
    return await doesStudentAlreadyAppliedRepo( studentId, sponsorshipId );
}