import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, switchMap, takeUntil} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalizedComponent} from "../../../shared/other/translation-loader-config";
import {LocalizationService} from "../../../services/localization.service";
import {UIPartsController} from "../../../services/ui-parts-controller.service";
import {InvestmentReq} from "../../../shared/models/investment-req.model";
import {User} from "../../../shared/models/user-models";
import {Roles} from "../../../shared/enums/Roles";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {InvestorType} from "../../../shared/enums/InvestorType";
import {InvestmentRequestsService} from "../../../services/api/investment-requests.service";
import {ContractsService} from "../../../services/api/contracts.service";
import {CreateContractModel} from "../../../shared/models/contract.model";
import {Statuses} from "../../../shared/enums/Statuses";
import {map} from "rxjs/operators";

@Component({
    selector: 'investment-req-data-view',
    templateUrl: './investment-req-data-view.component.html'
})
export class InvestmentReqDataViewComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

    private prevUIParts: any;
    private _investmentReqs: InvestmentReq[] = [];
    invReqsMenuItems: MenuItem[] = [];
    Roles = Roles;
    currentInvReq!: InvestmentReq;
    originalEvent!: any;

    destroy: Subject<any> = new Subject<any>();

    @Input()
    user!: User;
    @Input()
    set investmentReqs(val: InvestmentReq[]) {
        this._investmentReqs = [...val];
    }

    get investmentReqs() {
        return this._investmentReqs;
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

        this.buildMenuItems();
    }

    ngAfterViewInit(): void {
    }

    private buildMenuItems() {
        if(this.user.role === Roles.User || this.user.role === Roles.Admin) {
            this.invReqsMenuItems = [
                {
                    label: this.localizationService.getLanguage() === 'en' ? 'Accept Request' : 'Прийняти запрос',
                    icon: 'pi pi-check',
                    command: (ev) => {
                        this.confirmationService.confirm({
                            target: this.originalEvent.target as EventTarget,
                            message: 'Are you sure you want to accept request?',
                            icon: 'pi pi-exclamation-triangle',
                            accept: () => {
                                const contractModel: CreateContractModel = {
                                    startupId: this.currentInvReq.startupInfo?.id,
                                    investorId: this.currentInvReq.investorInfo?.id,
                                    investmentAmount: this.currentInvReq.investmentAmount,
                                    investmentTerm: this.currentInvReq.investmentTerm,
                                    status: Statuses.UnderReview
                                }

                                this.contractService.createContract(contractModel)
                                    .pipe(takeUntil(this.destroy))
                                    .pipe(switchMap(res => {
                                        return this.investmentReqService.deleteInvestmentReqById(this.currentInvReq.id!)
                                            .pipe(map(deleteRes => ({ createResponse: res, DeleteResponse: deleteRes })))
                                    }))
                                    .subscribe(responseObj => {
                                        console.log(responseObj);

                                        this.onRemovedItem(this.currentInvReq);
                                    })
                            }
                        })
                    }
                },
            ]
        } else {
            if(this.user.role === Roles.Investor) {
                this.invReqsMenuItems = [
                    {
                        label: this.localizationService.getLanguage() === 'en' ? 'Remove' : 'Видалити',
                        icon: 'pi pi-trash',
                        command: (ev) => {
                            this.confirmationService.confirm({
                                target: this.originalEvent.target as EventTarget,
                                message: 'Are you sure you want to delete investment Request?',
                                icon: 'pi pi-exclamation-triangle',
                                accept: () => {
                                    this.investmentReqService.deleteInvestmentReqById(this.currentInvReq.id!)
                                        .pipe(takeUntil(this.destroy))
                                        .subscribe(res => {
                                            this.toastService.add({ severity: 'success', summary: 'Success', detail: 'You have successfully deleted a post', life: 3000 });
                                            this.onRemovedItem(this.currentInvReq);
                                        })
                                }
                            });
                        }
                    },
                ]
            }
        }
    }

    onShowMenu(invReq: InvestmentReq) {
        this.currentInvReq = invReq;
    }

    getInvestorTypeName(investorType: InvestorType) {
        return investorType === InvestorType.AngelInvestor
            ? 'Angel Investor' : investorType === InvestorType.VentureCapitalist
                ? 'Venture Capitalist' : investorType === InvestorType.CorporateInvestor
                    ? 'Corporate Investor' : investorType === InvestorType.CrowdfundingInvestor
                        ? 'Crowdfunding Investor' : investorType === InvestorType.StateInvestor
                            ? 'State Investor' : '';
    }

    onRemovedItem(item: InvestmentReq) {
        const foundItem: InvestmentReq = this._investmentReqs.find(w => w.id === item.id)!;
        const indexOf = this._investmentReqs.indexOf(foundItem);
        if (indexOf >= 0) {
            this._investmentReqs.splice(indexOf, 1);
            this._investmentReqs = [...this._investmentReqs];
        }
    }
}
