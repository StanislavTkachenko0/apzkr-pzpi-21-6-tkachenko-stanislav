import {StartupModel} from "./startup-model";
import {Investor} from "./investor.model";
import {User} from "./user-models";
import {Statuses} from "../enums/Statuses";

export interface Contract {
    id?: number;
    startupInfo?: StartupModel;
    investorInfo?: Investor;
    userInfo?: User;
    investmentAmount?: number;
    investmentTerm?: number;
    status: Statuses;
}

export interface CreateContractModel {
    id?: number;
    startupId?: number;
    investorId?: number;
    investmentAmount?: number;
    investmentTerm?: number;
    status: Statuses;
}
