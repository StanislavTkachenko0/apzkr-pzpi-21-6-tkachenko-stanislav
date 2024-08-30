import {User} from "./user-models";
import {InvestorType} from "../enums/InvestorType";
import {DevelopmentStage} from "../enums/DevelopmentStages";

export interface StartupModel {
    id?: number,
    founder?: User,
    name?: string,
    description?: string,
    developmentStage?: DevelopmentStage,
    documentPath?: string,
    requiredBudget?: number,
    desiredInvestorType?: InvestorType,
    deadline?: number
    rating?: number
    founderId?: number
}
