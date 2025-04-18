import {promoRequest, parentRequest}  from "../../hook/api";
import { ForgotPasswordProps, PasswordUpdateProps, PasswordResetProps, SignInProps, ParentSignUpProps } from "./_model";

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



class AuthService {

    /**PROMO */
    async promoSignIn(payload: SignInProps) {

        try {
            const response = await promoRequest(
                '/promo/auth/login' , 
                'POST',
                payload,
                false,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }

    /**PARENT */
    async parentSignIn(payload: SignInProps) {

        try {
            const response = await parentRequest(
                '/promo/parent/auth/login' , 
                'POST',
                payload,
                false,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }

    async parentSignUp(payload: ParentSignUpProps) {
        try {
            const response = await parentRequest(
                '/promo/parent/auth/register' , 
                'POST',
                payload,
                false,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }

    async passwordReset(payload: PasswordResetProps) {
        try {
            const response = await promoRequest(
                '' , 
                'POST',
                payload,
                false,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }
       
    async promoForgotPassword(payload: ForgotPasswordProps) {
        try {
            const response = await promoRequest(
                '/promo/auth/password-reset' , 
                'POST',
                payload,
                false,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }

    async parentForgotPassword(payload: ForgotPasswordProps) {
        try {
            const response = await promoRequest(
                '/promo/parent/auth/password-reset' , 
                'POST',
                payload,
                false,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }

    async promoUpdatePassword(payload: PasswordUpdateProps) {
        try {
            const response = await promoRequest(
                '/promo/auth/password-update' , 
                'POST',
                payload,
                false,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }

    async parentUpdatePassword(payload: PasswordUpdateProps) {
        try {
            const response = await parentRequest(
                '/promo/parent/auth/password-update' , 
                'POST',
                payload,
                false,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }
}


export default AuthService;