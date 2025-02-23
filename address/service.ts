import { AddressResponse } from "../utils";
import { toAddressResponse } from "../utils/converter";
import { checkBarangayExistRepo, checkCityMunExistRepo, checkProvinceExistRepo, checkRegionExistRepo, getBarangaysRepo, getCityMunsRepo, getProvincesRepo, getRegionsRepo } from "./repository";


export const getRegions = async (): Promise<AddressResponse[]> => {

    const data: any[] = await getRegionsRepo();
    const converted: AddressResponse[] = toAddressResponse(data);
   
    return converted;

}

export const getProvinces = async ( regCode: string ): Promise<AddressResponse[]> => {

    const data: any[] = await getProvincesRepo(regCode);
    const converted: AddressResponse[] = toAddressResponse(data);
   
    return converted;

}

export const getCityMuns = async ( provinceCode: string ): Promise<AddressResponse[]> => {

    const data: any[] = await getCityMunsRepo(provinceCode);
    const converted: AddressResponse[] = toAddressResponse(data);
   
    return converted;

}

export const getBarangays = async ( citymunCode: string ): Promise<AddressResponse[]> => {

    const data: any[] = await getBarangaysRepo(citymunCode);
    const converted: AddressResponse[] = toAddressResponse(data);
   
    return converted;

}

export const checkRegionExist = async ( regCode: string = "", id: number = 0 ): Promise<boolean> => {
    return checkRegionExistRepo( regCode, id );
}

export const checkProvinceExist = async ( provinceCode: string = "", id: number = 0 ): Promise<boolean> => {
    return checkProvinceExistRepo( provinceCode, id );
}

export const checkCityMunExist = async ( citymunCode: string = "", id: number = 0 ):  Promise<boolean> => {
    return checkCityMunExistRepo( citymunCode, id );
}

export const checkBarangayExist = async ( brgCode: string = "", id: number = 0 ):  Promise<boolean> => {
    return checkBarangayExistRepo( brgCode, id );
}