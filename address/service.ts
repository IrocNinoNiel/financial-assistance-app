import { AddressResponse } from "../utils";
import { toAddressResponse } from "../utils/converter";
import { checkCityMunExistRepo, checkProvinceExistRepo, checkRegionExistRepo, getBarangaysRepo, getCityMunsRepo, getProvincesRepo, getRegionsRepo } from "./repository";


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

export const checkRegionExist = async ( regCode: string ): Promise<boolean> => {
    return checkRegionExistRepo( regCode );
}

export const checkProvinceExist = async ( provinceCode: string ): Promise<boolean> => {
    return checkProvinceExistRepo( provinceCode );
}

export const checkCityMunExist = async ( citymunCode: string ):  Promise<boolean> => {
    return checkCityMunExistRepo( citymunCode );
}