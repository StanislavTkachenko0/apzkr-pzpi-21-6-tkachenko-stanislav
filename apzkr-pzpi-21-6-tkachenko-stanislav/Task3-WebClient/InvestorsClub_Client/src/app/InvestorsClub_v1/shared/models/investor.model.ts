import {User} from "./user-models";
import {InvestorType} from "../enums/InvestorType";

export interface Investor {
    id?: number;
    investorInfo?: User;
    investorType?: InvestorType;
    interestsAndPreferences?: string;
    budget?: number
}
