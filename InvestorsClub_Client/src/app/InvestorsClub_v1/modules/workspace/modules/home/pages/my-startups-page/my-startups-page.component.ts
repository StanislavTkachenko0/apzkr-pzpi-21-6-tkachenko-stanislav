import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {catchError, finalize, Subject, takeUntil} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalizedComponent} from "../../../../../../shared/other/translation-loader-config";
import {LocalizationService} from "../../../../../../services/localization.service";
import {UIPartsController} from "../../../../../../services/ui-parts-controller.service";
import {MainHomePageComponent} from "../main-home-page/main-home-page.component";
import {HomePages} from "../../../../../admin/shared/enums/Pages";
import {MainWorkspacePageComponent} from "../../../../pages/main-workspace-page/main-workspace-page.component";
import {StartupsService} from "../../../../../../services/api/startups.service";
import {StartupModel} from "../../../../../../shared/models/startup-model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DevelopmentStage} from "../../../../../../shared/enums/DevelopmentStages";
import {InvestorType} from "../../../../../../shared/enums/InvestorType";

@Component({
  selector: 'my-startups',
  templateUrl: './my-startups-page.component.html'
})
export class MyStartupsPageComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

    private prevUIParts: any;

    destroy: Subject<any> = new Subject<any>();

    myStartups: StartupModel[] = [];
    currentStartup!: StartupModel;
    visibleDialog!: boolean;
    form!: FormGroup;
    isLoading!: boolean;
    developmentStages = [
        { name: this.localizationService.getLanguage() === 'en' ? 'Idea Stage' : 'Стадія ідеї',
          code: DevelopmentStage.IdeaStage },
        { name: this.localizationService.getLanguage() === 'en' ? 'Launch Stage' : 'Стадія запуску',
            code: DevelopmentStage.LaunchStage },
        { name: this.localizationService.getLanguage() === 'en' ? 'Early Stage' : 'Рання стадія',
            code: DevelopmentStage.EarlyStage },
        { name: this.localizationService.getLanguage() === 'en' ? 'Growth Stage' : 'Стадія росту',
            code: DevelopmentStage.GrowthStage },
        { name: this.localizationService.getLanguage() === 'en' ? 'Mature Stage' : 'Зріла стадія',
            code: DevelopmentStage.MatureStage }
    ];

    desiredInvestorTypes = [
        { name: this.localizationService.getLanguage() === 'en' ? 'Angel Investor' : 'Ангельський інвестор',
            code: InvestorType.AngelInvestor },
        { name: this.localizationService.getLanguage() === 'en' ? 'State Investor' : 'Державний інвестор',
            code: InvestorType.StateInvestor },
        { name: this.localizationService.getLanguage() === 'en' ? 'Venture Capitalist' : 'Венчурний капіталіст',
            code: InvestorType.VentureCapitalist },
        { name: this.localizationService.getLanguage() === 'en' ? 'Corporate Investor' : 'Корпоративний інвестор',
            code: InvestorType.CorporateInvestor },
        { name: this.localizationService.getLanguage() === 'en' ? 'Crowdfunding Investor' : 'Краудфандинговий інвестор',
            code: InvestorType.CrowdfundingInvestor },
    ]

  constructor(translate: TranslateService, localizationService: LocalizationService,
              private router: Router,
              private route: ActivatedRoute,
              private startupsService: StartupsService,
              public workspaceParent: MainWorkspacePageComponent,
              private parent: MainHomePageComponent,
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

    this.getMyStartups();
    this.initCreateStartupForm()
  }

  ngAfterViewInit(): void {
    this.parent.activateTab(HomePages.MyStartups);
  }

  private initCreateStartupForm() {
      this.form = new FormGroup<any>({
          name: new FormControl(null, [Validators.required]),
          description: new FormControl(null, [Validators.required]),
          developmentStage: new FormControl(null, []),
          documentPath: new FormControl(null, []),
          requiredBudget: new FormControl(null, [Validators.required]),
          desiredInvestorType: new FormControl(null, []),
          deadline: new FormControl(null, [Validators.required]),
      })
  }

  private getMyStartups() {
      this.startupsService.getStartupsByFounder(this.workspaceParent.user.id!)
          .pipe(takeUntil(this.destroy))
          .subscribe(sts => {
              this.myStartups = sts;
          })
  }

    onShowCreateDialog(startup?: StartupModel) {
        this.visibleDialog = true;

        if (!!startup) {
            this.currentStartup = startup;

            this.form.get('name')?.patchValue(startup.name);
            this.form.get('description')?.patchValue(startup.description);
            this.form.get('developmentStage')?.patchValue(startup.developmentStage);
            this.form.get('documentPath')?.patchValue(startup.documentPath);
            this.form.get('requiredBudget')?.patchValue(startup.requiredBudget);
            this.form.get('desiredInvestorType')?.patchValue(startup.desiredInvestorType);
            this.form.get('deadline')?.patchValue(startup.deadline);
        }
    }

    onCreateStartup() {
        if(this.form.invalid) { return; }

        const startupModel: StartupModel = {
            founderId: this.workspaceParent.user.id,
            name: this.form.get('name')?.value,
            description: this.form.get('description')?.value,
            developmentStage: this.form.get('developmentStage')?.value.code,
            documentPath: this.form.get('documentPath')?.value,
            requiredBudget: this.form.get('requiredBudget')?.value,
            desiredInvestorType: this.form.get('desiredInvestorType')?.value.code,
            deadline: this.form.get('deadline')?.value,
        };

        this.isLoading = true;
        this.startupsService.createStartup(startupModel)
            .pipe(takeUntil(this.destroy))
            .pipe(finalize(() => {
                this.isLoading = false;
                this.visibleDialog = false;
            }))
            .subscribe(res => {
                this.getMyStartups();
            });
    }

    onEditStartup() {
        if(this.form.invalid) { return; }

        const startupModel: StartupModel = {
            id: this.currentStartup.id,
            founderId: this.workspaceParent.user.id,
            founder: this.currentStartup.founder,
            rating: this.currentStartup.rating,
            name: this.form.get('name')?.value,
            description: this.form.get('description')?.value,
            developmentStage: this.form.get('developmentStage')?.value.code,
            documentPath: this.form.get('documentPath')?.value,
            requiredBudget: this.form.get('requiredBudget')?.value,
            desiredInvestorType: this.form.get('desiredInvestorType')?.value.code,
            deadline: this.form.get('deadline')?.value,
        };

        this.isLoading = true;
        this.startupsService.editStartup(startupModel)
            .pipe(takeUntil(this.destroy))
            .pipe(finalize(() => {
                this.isLoading = false;
                this.visibleDialog = false;
            }))
            .subscribe(res => {
                this.getMyStartups();
            });
    }
}
