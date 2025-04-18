
export interface ParentSignUpProps {
    firstName: string,
    lastName: string,
    email: string,
    country: string,
    state: string,
    phone: string,
    password: string,
    timezone: string,

}

export interface AddChildProps {
    firstName: string,
    lastName: string,
    age: number,
    gender: string
}

export interface PartnerSignUpProps {
    organizationName: string;
    organizationAddress: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    password: string;
}

export interface SignInProps {
    email: string,
    password: string
}

export interface ParentInvite {
    emails: string,
    kidsNum: number
}

export interface PasswordResetProps { }

export interface ForgotPasswordProps { }

export interface ProfileUpdateProps {
    firstName: string,
    lastName: string
}

export interface PasswordUpdateProps {
    password1: string,
    password2: string,
    passwordOld: string,
    email: string
}

export interface AddTestimonial {
    testimonial: string,
}

export interface AddChildProps {
    firstName: string,
    lastName: string,
    age: number,
    gender: string
}

export interface AddProgramProps {
    timeOffset: any;
    timeGroupId: number | undefined;
    timeGroupIndex: number | undefined;
    level: number;
}