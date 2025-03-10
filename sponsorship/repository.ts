import { Prisma, PrismaClient, sponsorship, sponsorshipSchool } from "@prisma/client";
import { RecordStatus, uuidToBinary } from "../utils";
import { getAllSponsorship } from './service';

const prisma = new PrismaClient({  });

export const createSponsorshipRepo = async(data: Prisma.sponsorshipUncheckedCreateInput): Promise<sponsorship> => {
    return await prisma.sponsorship.create({ data, include:{
        academicYear: { select: { academic_year_start: true, academic_year_end: true}},
        sponsor: { select: { first_name: true, middle_name: true, last_name: true }},
        coordinator: { select: { first_name: true, middle_name: true, last_name: true }}
    } });
}

export const createSponsorshipSchoolRepo = async(data: Prisma.sponsorshipSchoolUncheckedCreateInput[], sponsorshipId: string): Promise<any> => {
    await prisma.sponsorshipSchool.createMany({ data, skipDuplicates: true, });
    return prisma.sponsorshipSchool.findMany({
        where: {
            sponsorship_id: uuidToBinary(sponsorshipId)
        },
        include: {
            school: { select: { school_name: true }},
        }
    });
}

export const getAllSponsorshipSchoolRepo = async ( sponsorshipId: string) => {
    return prisma.sponsorshipSchool.findMany({
        where: {
            sponsorship_id: uuidToBinary(sponsorshipId)
        },
        include: {
            school: { select: { school_name: true }},
        }
    });
}

export const createSponsorshipRequirementRepo = async(data: Prisma.sponsorshipRequirementUncheckedCreateInput[], sponsorshipId: string): Promise<any> => {
    await prisma.sponsorshipRequirement.createMany({ data, skipDuplicates: true, });
    return prisma.sponsorshipRequirement.findMany({
        where: {
            sponsorship_id: uuidToBinary(sponsorshipId)
        },
        include: {
            fileType: { select: { name: true }},
        }
    });
}

export const getAllSponsorshipRequirements = async( sponsorshipId: string ) => {
    return prisma.sponsorshipRequirement.findMany({
        where: {
            sponsorship_id: uuidToBinary(sponsorshipId)
        },
        include: {
            fileType: { select: { name: true }},
        }
    });
}

export const getAllSponsorshipRepo = async( whereCondition: any): Promise<any> => {
    return await prisma.sponsorship.findMany({ where: whereCondition, include:{
        academicYear: { select: { academic_year_start: true, academic_year_end: true}},
        sponsor: { select: { first_name: true, middle_name: true, last_name: true }},
        coordinator: { select: { first_name: true, middle_name: true, last_name: true }}
    } });
}

export const getOneSponsorshipRepo = async (id: string): Promise<any> => {
    return await prisma.sponsorship.findUnique({ where: { id: uuidToBinary(id) }, include:{
        academicYear: { select: { academic_year_start: true, academic_year_end: true}},
        sponsor: { select: { first_name: true, middle_name: true, last_name: true }},
        coordinator: { select: { first_name: true, middle_name: true, last_name: true }}
    } });
}

export const updateSponsorshipRepo = async (id: string, data: Prisma.sponsorshipUncheckedUpdateInput): Promise<any> => {
    return await prisma.sponsorship.update({ where: { id: uuidToBinary(id) }, data, include:{
        academicYear: { select: { academic_year_start: true, academic_year_end: true}},
        sponsor: { select: { first_name: true, middle_name: true, last_name: true }},
        coordinator: { select: { first_name: true, middle_name: true, last_name: true }}
    } });
}

export const deleteOneSponsorshipRepo = async (id: string) => {
    await prisma.sponsorship.update({ where: { id: uuidToBinary(id) }, data: {record_status: RecordStatus.DELETED } });
}

export const checkIfSponsorshipExistRepo = async (name: string, batchNumber: number,  sponsorshipId: any): Promise<boolean> => {

    const whereCondition: any =  {
        name,
        batch_number: batchNumber,
        record_status: RecordStatus.ACTIVE
    };

    if (sponsorshipId) {
        whereCondition.id = { not: uuidToBinary(sponsorshipId) };
    }


    const data =  await prisma.sponsorship.findFirst({
        where: whereCondition,
    });
    return data !== null;
}


export const checkSponsorshipIdRepo = async ( sponsorshipId: string ): Promise<boolean> => {
    const data =  await prisma.sponsorship.findFirst({
        where: {
          id: uuidToBinary(sponsorshipId),
          record_status: RecordStatus.ACTIVE
        },
    });
    return data === null;
}

export const deleteAllSponsorshipSchools = async (sponsorshipId: string) => {
    await prisma.sponsorshipSchool.deleteMany({
        where: { sponsorship_id: uuidToBinary(sponsorshipId) },
    });
};

export const deleteAllSponsorshipRequirements = async (sponsorshipId: string) => {
    await prisma.sponsorshipRequirement.deleteMany({
        where: { sponsorship_id: uuidToBinary(sponsorshipId) },
    });
};