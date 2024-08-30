import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, switchMap, takeUntil} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalizedComponent} from "../../../shared/other/translation-loader-config";
import {LocalizationService} from "../../../services/localization.service";
import {UIPartsController} from "../../../services/ui-parts-controller.service";
import {CreateInvestmentReq} from "../../../shared/models/investment-req.model";
import {User} from "../../../shared/models/user-models";
import {Roles} from "../../../shared/enums/Roles";
import {ConfirmationService, MessageService} from "primeng/api";
import {InvestorType} from "../../../shared/enums/InvestorType";
import {InvestmentRequestsService} from "../../../services/api/investment-requests.service";
import {ContractsService} from "../../../services/api/contracts.service";
import {Contract} from "../../../shared/models/contract.model";
import {Statuses} from "../../../shared/enums/Statuses";
import {map} from "rxjs/operators";

@Component({
    selector: 'contracts-data-view',
    templateUrl: './contracts-data-view.component.html'
})
export class ContractsDataViewComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

    private prevUIParts: any;
    private _contracts: Contract[] = [];
    Roles = Roles;
    Statuses = Statuses;
    currentContract!: Contract;
    originalEvent!: any;

    destroy: Subject<any> = new Subject<any>();

    @Input()
    user!: User;
    @Input()
    set contracts(val: Contract[]) {
        this._contracts = [...val];
    }

    get contracts() {
        return this._contracts;
    }


    constructor(translate: TranslateService, localizationService: LocalizationService,
                private router: Router,
                private route: ActivatedRoute,
                private investmentReqService: InvestmentRequestsService,
                private confirmationService: ConfirmationService,
                private contractService: ContractsService,
                private toastService: MessageService,
                public uiParts: UIPartsController,) {
        super(translate, localizationService)
    }

    ngOnDestroy(): void {
        this.destroy.next(null);
        this.destroy.complete();

        this.uiParts.restoreValue(this.prevUIParts);
    }

    ngOnInit(): void {
        this.prevUIParts = this.uiParts.storeValue();
    }

    ngAfterViewInit(): void {
    }

    getInvestorTypeName(investorType: InvestorType) {
        return investorType === InvestorType.AngelInvestor
            ? 'Angel Investor' : investorType === InvestorType.VentureCapitalist
                ? 'Venture Capitalist' : investorType === InvestorType.CorporateInvestor
                    ? 'Corporate Investor' : investorType === InvestorType.CrowdfundingInvestor
                        ? 'Crowdfunding Investor' : investorType === InvestorType.StateInvestor
                            ? 'State Investor' : '';
    }

    onRemovedItem(item: Contract) {
        const foundItem: Contract = this._contracts.find(w => w.id === item.id)!;
        const indexOf = this._contracts.indexOf(foundItem);
        if (indexOf >= 0) {
            this._contracts.splice(indexOf, 1);
            this._contracts = [...this._contracts];
        }
    }

    onRefuseContract(event: MouseEvent, contract: Contract) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to Refuse Contract?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const invReqModel: CreateInvestmentReq = {
                    startupId: contract.startupInfo?.id,
                    investorId: contract.investorInfo?.id,
                    investmentAmount: contract.investmentAmount,
                    investmentTerm: contract.investmentTerm
                }

                this.investmentReqService.createInvestmentRequest(invReqModel)
                    .pipe(takeUntil(this.destroy))
                    .pipe(switchMap(createRes => {
                        return this.contractService.deleteContractById(contract.id!)
                            .pipe(map(deleteRes => ({ createResponse: createRes, deleteResponse: deleteRes })))
                    }))
                    .subscribe(responseObj => {
                        this.onRemovedItem(contract);
                    });
            }
        });
    }

    onAcceptContract(event: MouseEvent, contract: Contract) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to Sign the contract?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.contractService.updateContractStatus(contract.id!, Statuses.Approved)
                    .pipe(takeUntil(this.destroy))
                    .subscribe(res => {
                        console.log(res)
                        contract.status = Statuses.Approved;
                    })
            }
        });
    }

    getContractStatus(contract: Contract) {
        return contract.status === Statuses.UnderReview
            ? 'Under Review' : contract.status === Statuses.Approved
                ? 'Approved' : contract.status === Statuses.Cancelled
                    ? 'Cancelled' : contract.status === Statuses.InProgress
                        ? 'In Progress' : contract.status === Statuses.Completed
                            ? 'Completed' : contract.status === Statuses.Postponed
                                ? 'Postponed' : '';
    }
}
