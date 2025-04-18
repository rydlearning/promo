import {promoRequest}  from "../../hook/api";
import {ParentInvite } from "./_model";

/**
 *
 * @param {string} url
 * @param {string, [GET, POST, PATCH, PUT...]} method
 * @param {payload} payload
 * @param {boolean} token
 * @param {boolean} text
 * @param {boolean} form
 * @param {string | null} xHash
 * @returns Response Data;
 */



class PromoService {

    async allPromoPrograms() {
        try {
            const response = await promoRequest(
                '/promo/cohort/all' ,
                'GET',
                {},
                true,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }

    async allPromoParent() {
        try {
            const response = await promoRequest(
                '/promo/parent/all' ,
                'GET',
                {},
                true,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }

    async promoGetParent( id: number,  cid: number) {
        try {
            const response = await promoRequest(
                `/promo/parent/${id}/${cid}` ,
                'GET',
                {},
                true,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }

    async promoGetCohort( id: number ) {
        try {
            const response = await promoRequest(
                `/promo/cohort/${id}` ,
                'GET',
                {},
                true,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }

    async disableParent(id:any) {
        try {
            const response = await promoRequest(
                `/promo/disable/parent/${id}` ,
                'PUT',
                {},
                true,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }

    async enableParent(id:any) {
        try {
            const response = await promoRequest(
                `/promo/enable/parent/${id}` ,
                'PUT',
                {},
                true,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }
}


export default PromoService;
