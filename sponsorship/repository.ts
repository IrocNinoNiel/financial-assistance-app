import { Prisma, PrismaClient, sponsorship, sponsorshipSchool } from "@prisma/client";
import { RecordStatus, uuidToBinary } from "../utils";

const prisma = new PrismaClient({  });

export const createSponsorshipRepo = async(data: Prisma.sponsorshipUncheckedCreateInput): Promise<sponsorship> => {
    return await prisma.sponsorship.create({ data, include:{
        academicYear: { select: { academic_year_start: true, academic_year_end: true}},
        sponsor: { select: { first_name: true, middle_name: true, last_name: true }}
    } });
}

export const createSponsorshipSchoolRepo = async(data: Prisma.sponsorshipSchoolUncheckedCreateInput[]): Promise<any> => {
    await prisma.sponsorshipSchool.createMany({ data, skipDuplicates: true, });
    return prisma.sponsorshipSchool.findMany({
        where: {
          school_id: { in: data.map(d => d.school_id) }
        },
        include: {
            school: { select: { school_name: true }},
        }
    });
}

export const createSponsorshipRequirementRepo = async(data: Prisma.sponsorshipRequirementUncheckedCreateInput[]): Promise<any> => {
    await prisma.sponsorshipRequirement.createMany({ data, skipDuplicates: true, });
    return prisma.sponsorshipRequirement.findMany({
        where: {
          file_type_id: { in: data.map(d => d.file_type_id) }
        },
        include: {
            fileType: { select: { name: true }},
        }
    });
}

export const getAllSponsorshipRepo = async(): Promise<any> => {
    return await prisma.sponsorship.findMany({ where: {record_status: RecordStatus.ACTIVE}});
}

export const getOneSponsorshipRepo = async (id: string): Promise<any> => {
    return await prisma.sponsorship.findUnique({ where: { id: uuidToBinary(id) } });
}

export const updateSponsorshipRepo = async (id: string, data: Prisma.sponsorshipUncheckedUpdateInput): Promise<any> => {
    return await prisma.sponsorship.update({ where: { id: uuidToBinary(id) }, data });
}

export const deleteOneSponsorshipRepo = async (id: string) => {
    await prisma.sponsorship.update({ where: { id: uuidToBinary(id) }, data: {record_status: RecordStatus.DELETED } });
}

export const checkExistingAcademicYearRepo = async (sponsorshipStart: number, sponsorshipEnd: number, schoolTerm: number, sponsorshipId: any): Promise<boolean> => {
   
    const whereCondition: any =  {
        academic_year_start: sponsorshipStart,
        academic_year_end: sponsorshipEnd,
        school_term: schoolTerm,
    };

     if (sponsorshipId) {
        whereCondition.id = { not: uuidToBinary(sponsorshipId) };
     }


    const data =  await prisma.sponsorship.findFirst({
        where: whereCondition,
    });
    return data !== null;
}


export const checkAcademicYearIdRepo = async ( sponsorshipId: string ): Promise<boolean> => {
    const data =  await prisma.sponsorship.findFirst({
        where: {
          id: uuidToBinary(sponsorshipId),
          record_status: RecordStatus.ACTIVE
        },
    });
    return data === null;
}
