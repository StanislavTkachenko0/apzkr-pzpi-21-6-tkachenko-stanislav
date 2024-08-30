import {InvestorType} from "../enums/InvestorType";
import {Roles} from "../enums/Roles";

export interface AuthResponseModel {
    email: string;
    password: string;
}

export interface RegisterModel {
    email: string;
    password: string;
    role?: Roles,
    investorType?: InvestorType,
    budget?: number;
}
