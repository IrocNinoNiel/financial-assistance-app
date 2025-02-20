import { Router } from "express";
import { ResponseHandler } from "../response";
import { getBarangays, getCityMuns, getProvinces, getRegions } from "./service";
import { validateCityMunCode, validateProvinceCode, validateRegionCode } from "../middleware/validation";

export default () => {

    const addressAPI = Router();

    addressAPI.get('/regions', async (req, res) => {

        try {
            const data = await getRegions();
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    addressAPI.get('/provinces', validateRegionCode, async (req, res) => {

        try {
            const { regCode } = req.query;
            const data = await getProvinces( regCode );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    addressAPI.get('/citymuns', validateProvinceCode, async (req, res) => {

        try {
            const { provinceCode } = req.query;
            const data = await getCityMuns( provinceCode );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

    addressAPI.get('/barangays', validateCityMunCode, async (req, res) => {

        try {
            const { citymunCode } = req.query;
            const data = await getBarangays( citymunCode );
            ResponseHandler.ok(req, res, data);
        } catch (err) {
            ResponseHandler.invalidRequest(req,res , err.message);
        }
    });

   

    return addressAPI;
}