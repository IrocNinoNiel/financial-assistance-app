import { Prisma, sponsorship } from "@prisma/client";
import { binaryToUuid, extractUserFromToken, SponsorshipRequest, uuidToBinary } from "../utils";
import { toSponsorReqModel, toSponsorSchoolModel, toSponsorshipModel, toSponsorshipResponse } from "../utils/converter";
import { createSponsorshipRepo, createSponsorshipRequirementRepo, createSponsorshipSchoolRepo } from "./repository";


export const createAcadYear = async ( payload: SponsorshipRequest, authHeader: any ) => {
    
    const userDetails = extractUserFromToken(authHeader);
    const userId = userDetails.userId;
    const data: Prisma.sponsorshipUncheckedCreateInput = toSponsorshipModel( payload, userId);
    const sponsorship: sponsorship = await createSponsorshipRepo( data );

    let schools: any[];
    let requirements: any[];

    // create SponsorshipSchool data
    if(payload.sponsorshipSchool && payload.sponsorshipSchool.length > 0) {
        const convertedSponSchool: Prisma.sponsorshipSchoolUncheckedCreateInput[] = toSponsorSchoolModel( payload.sponsorshipSchool, binaryToUuid(sponsorship.id))
        schools = await createSponsorshipSchoolRepo( convertedSponSchool );
    }

    // create Sponsorship Requirements data
    if(payload.sponsorshipRequirements && payload.sponsorshipRequirements.length > 0) {
        const convertedSponReq: Prisma.sponsorshipRequirementUncheckedCreateInput[] = toSponsorReqModel( payload.sponsorshipRequirements, binaryToUuid(sponsorship.id))
        requirements = await createSponsorshipRequirementRepo( convertedSponReq )
    }

    return toSponsorshipResponse( sponsorship, schools, requirements );
}