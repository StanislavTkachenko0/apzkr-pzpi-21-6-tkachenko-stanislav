import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {finalize, Subject, switchMap, takeUntil} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {LocalizationService} from "../../services/localization.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UIPartsController} from "../../services/ui-parts-controller.service";
import {StartupModel} from "../../shared/models/startup-model";
import {LocalizedComponent} from "../../shared/other/translation-loader-config";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {StartupsService} from "../../services/api/startups.service";
import {User} from "../../shared/models/user-models";
import {Roles} from "../../shared/enums/Roles";
import {InvestorType} from "../../shared/enums/InvestorType";
import {DevelopmentStage} from "../../shared/enums/DevelopmentStages";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {InvestmentRequestsService} from "../../services/api/investment-requests.service";
import {CreateInvestmentReq} from "../../shared/models/investment-req.model";
import {Review} from "../../shared/models/review.model";
import {Dialog} from "primeng/dialog";
import {InvestorService} from "../../services/api/investor.service";

@Component({
  selector: 'startups-data-view',
  templateUrl: './startups-data-view.component.html'
})
export class StartupsDataViewComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

    private prevUIParts: any;

    destroy: Subject<any> = new Subject<any>();

    private _startups: StartupModel[] = []
    startupMenuItems: MenuItem[] = [];
    currentStartup!: StartupModel;
    Roles = Roles;
    visibleInvestmentReq!: boolean;
    visibleReview!: boolean;
    createInvestmentForm!: FormGroup;
    getReviewForm!: FormGroup;
    isLoadingInvestReq!: boolean;
    isLoadingReview!: boolean;

    @Input()
    canModify: boolean = false;
    @Input()
    user!: User;
    @Input()
    set startups(val: StartupModel[]) {
      this._startups = val;
    }

    @Output()
    onEditStartup: EventEmitter<StartupModel> = new EventEmitter<StartupModel>();

    get startups(): StartupModel[] {
      return this._startups;
    }

  constructor(translate: TranslateService, localizationService: LocalizationService,
              private router: Router,
              private route: ActivatedRoute,
              private confirmationService: ConfirmationService,
              private toastService: MessageService,
              private investorService: InvestorService,
              private investmentReqService: InvestmentRequestsService,
              private startupService: StartupsService,
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
    this.initForms();
  }

  ngAfterViewInit(): void {
  }

  private initForms() {
        this.createInvestmentForm = new FormGroup<any>({
            investmentAmount: new FormControl(null, [Validators.required]),
            investmentTerm: new FormControl(null, [Validators.required])
        })

      this.getReviewForm = new FormGroup<any>({
          text: new FormControl(null, []),
          rating: new FormControl(null, [Validators.required])
      })
  }

  private buildMenuItems() {
        if(this.canModify) {
            this.startupMenuItems = [
                {
                    label: this.localizationService.getLanguage() === 'en' ? 'Remove' : 'Видалити',
                    icon: 'pi pi-trash',
                    command: (ev) => {
                        this.confirmationService.confirm({
                            target: ev.originalEvent.target as EventTarget,
                            message: 'Are you sure you want to delete startup?',
                            icon: 'pi pi-exclamation-triangle',
                            accept: () => {
                                this.startupService.deleteStartupById(this.currentStartup.id!)
                                    .pipe(takeUntil(this.destroy))
                                    .subscribe(res => {
                                        this.toastService.add({ severity: 'success', summary: 'Success', detail: 'You have successfully deleted a post', life: 3000 });
                                        this.onRemovedItem(this.currentStartup);
                                    })
                            }
                        });
                    }
                },
                {
                    label: this.localizationService.getLanguage() === 'en' ? 'Edit' : 'Редагувати',
                    icon: 'pi pi-pencil',
                    command: (ev) => {
                        this.onEditStartup.emit(this.currentStartup);
                    }
                }
            ]
        } else {
            if(this.user.role === Roles.Investor) {
                this.startupMenuItems = [
                    {
                        label: this.localizationService.getLanguage() === 'en' ? 'Investment Request' : 'Інвестувати',
                        icon: 'pi pi-chart-line',
                        command: (ev) => {
                            this.visibleInvestmentReq = true;
                        }
                    },
                    {
                        label: this.localizationService.getLanguage() === 'en' ? 'Give Review' : 'Написати Відгук',
                        icon: 'pi pi-bookmark',
                        command: (ev) => {
                            this.visibleReview = true;
                        }
                    }
                ]
            }
        }
  }

    onShowMenu(startup: StartupModel) {
        this.currentStartup = startup;
    }

    getInfoForStartup(startup: StartupModel) {
        this.startupService.getAverageOfStartup(startup.id!)
            .pipe(takeUntil(this.destroy))
            .subscribe(av => {
                startup.rating = av;
            })
    }

    onRemovedItem(item: StartupModel) {
        const foundItem: StartupModel = this._startups.find(w => w.id === item.id)!;
        const indexOf = this._startups.indexOf(foundItem);
        if (indexOf >= 0) {
            this._startups.splice(indexOf, 1);
            this._startups = [...this._startups];
        }
    }

    getDesiredInvestorTypeName(desiredInvestorType: InvestorType) {
        return desiredInvestorType === InvestorType.AngelInvestor
            ? 'Angel Investor' : desiredInvestorType === InvestorType.VentureCapitalist
            ? 'Venture Capitalist' : desiredInvestorType === InvestorType.CorporateInvestor
            ? 'Corporate Investor' : desiredInvestorType === InvestorType.CrowdfundingInvestor
            ? 'Crowdfunding Investor' : desiredInvestorType === InvestorType.StateInvestor
            ? 'State Investor' : '';
    }

    getDevelopmentStageName(developmentStage: DevelopmentStage) {
        return developmentStage === DevelopmentStage.IdeaStage
            ? 'Idea Stage' : developmentStage === DevelopmentStage.LaunchStage
            ? 'Launch Stage' : developmentStage === DevelopmentStage.EarlyStage
            ? 'Early Stage' : developmentStage === DevelopmentStage.GrowthStage
            ? 'Growth Stage' : developmentStage === DevelopmentStage.MatureStage
            ? 'Mature Stage' : ''
    }

    onInvestmentRequest(startup: StartupModel, dialog: Dialog, event: MouseEvent) {
        if(this.createInvestmentForm.invalid) { return; }

        this.isLoadingInvestReq = true;
        this.investorService.getInvestorByEmail(this.user.email!)
            .pipe(takeUntil(this.destroy))
            .pipe(switchMap(investor => {

                const invReq: CreateInvestmentReq = {
                    startupId: startup.id,
                    investorId: investor.id,
                    investmentAmount: this.createInvestmentForm.get('investmentAmount')?.value,
                    investmentTerm: this.createInvestmentForm.get('investmentTerm')?.value
                }

                return this.investmentReqService.createInvestmentRequest(invReq);
            }))
            .pipe(finalize(() => this.isLoadingInvestReq = false))
            .subscribe(res => {
                this.toastService.add({ severity: 'success', summary: 'Success', detail: 'You have successfully created investment request', life: 3000 });

                dialog.close(event);
            })
    }

    onGetReview(startup: StartupModel, dialog: Dialog, event: MouseEvent) {
        if(this.getReviewForm.invalid) { return; }

        const review: Review = {
            startupId: startup.id,
            userId: this.user.id,
            text: this.getReviewForm.get('text')?.value,
            rating: this.getReviewForm.get('rating')?.value
        }

        this.isLoadingReview = true;
        this.startupService.createReviewForStartup(review)
            .pipe(takeUntil(this.destroy))
            .pipe(finalize(() => this.isLoadingReview = false))
            .subscribe(res => {
                this.toastService.add({ severity: 'success', summary: 'Success', detail: 'You have successfully get review for startup', life: 3000 });

                dialog.close(event);
            })
    }
}
