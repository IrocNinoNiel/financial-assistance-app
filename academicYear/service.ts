import { createAcadYearRepo } from "./repository";

export const createAcadYear = async ( data: any) => {
    
    const acadYear = await createAcadYearRepo( data );
}