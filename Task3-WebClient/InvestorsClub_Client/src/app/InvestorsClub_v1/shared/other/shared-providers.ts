import {AuthService} from "../../services/api/auth.service";
import {LocalizationService} from "../../services/localization.service";
import {UIPartsController} from "../../services/ui-parts-controller.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {UserService} from "../../services/api/user.service";
import {NewsService} from "../../services/api/news.service";
import {DialogService} from "primeng/dynamicdialog";
import {HashService} from "../../services/api/hash.service";
import {StartupsService} from "../../services/api/startups.service";
import {InvestmentRequestsService} from "../../services/api/investment-requests.service";
import {ContractsService} from "../../services/api/contracts.service";
import {InvestorService} from "../../services/api/investor.service";

export const sharedProviders = [
  AuthService, LocalizationService, UIPartsController, MessageService, UserService, NewsService, DialogService,
  HashService, ConfirmationService, StartupsService, InvestmentRequestsService, ContractsService, InvestorService
]
