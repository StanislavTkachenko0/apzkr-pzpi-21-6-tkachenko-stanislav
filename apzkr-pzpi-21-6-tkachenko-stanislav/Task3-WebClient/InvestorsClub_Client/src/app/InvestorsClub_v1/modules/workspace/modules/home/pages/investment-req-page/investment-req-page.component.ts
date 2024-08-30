import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {catchError, of, Subject, takeUntil} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalizedComponent} from "../../../../../../shared/other/translation-loader-config";
import {LocalizationService} from "../../../../../../services/localization.service";
import {UIPartsController} from "../../../../../../services/ui-parts-controller.service";
import {MainHomePageComponent} from "../main-home-page/main-home-page.component";
import {HomePages} from "../../../../../admin/shared/enums/Pages";
import {MainWorkspacePageComponent} from "../../../../pages/main-workspace-page/main-workspace-page.component";
import {InvestmentRequestsService} from "../../../../../../services/api/investment-requests.service";
import {InvestmentReqModule} from "../../../../../../components/investment-req-data-view/investment-req.module";

@Component({
  selector: 'investment-req',
  templateUrl: './investment-req-page.component.html'
})
export class InvestmentReqPageComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

  private prevUIParts: any;

  destroy: Subject<any> = new Subject<any>();

  investmentsReqs: InvestmentReqModule[] = [];

  constructor(translate: TranslateService, localizationService: LocalizationService,
              private router: Router,
              private route: ActivatedRoute,
              private invService: InvestmentRequestsService,
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

    this.getInvestmentReqs();
  }

  ngAfterViewInit(): void {
    this.parent.activateTab(HomePages.InvestorsReq);
  }

  private getInvestmentReqs() {
      const email = this.workspaceParent.user.email;

      this.invService.getInvestmentRequestsByEmail(email!)
          .pipe(takeUntil(this.destroy))
          .pipe(catchError((err: any) => {
              if(err.status === 404) {
                  return of([])
              } else {
                  return of(null)
              }
          }))
          .subscribe(res => {
              if(res === null) { return; }

              this.investmentsReqs = [...res];
          })
  }
}
