import {StartupModel} from "./startup-model";
import {Investor} from "./investor.model";

export interface InvestmentReq {
    id?: number;
    startupInfo?: StartupModel;
    investorInfo?: Investor;
    investmentAmount?: number;
    investmentTerm?: number
}

export interface CreateInvestmentReq {
    id?: number;
    startupId?: number;
    investorId?: number;
    investmentAmount?: number;
    investmentTerm?: number
}
