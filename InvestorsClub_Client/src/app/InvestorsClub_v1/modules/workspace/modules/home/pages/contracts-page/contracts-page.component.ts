import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, take, takeUntil} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalizedComponent} from "../../../../../../shared/other/translation-loader-config";
import {LocalizationService} from "../../../../../../services/localization.service";
import {UIPartsController} from "../../../../../../services/ui-parts-controller.service";
import {MainHomePageComponent} from "../main-home-page/main-home-page.component";
import {HomePages} from "../../../../../admin/shared/enums/Pages";
import {MainWorkspacePageComponent} from "../../../../pages/main-workspace-page/main-workspace-page.component";
import {ContractsService} from "../../../../../../services/api/contracts.service";
import {Contract} from "../../../../../../shared/models/contract.model";

@Component({
  selector: 'contracts-page',
  templateUrl: './contracts-page.component.html'
})
export class ContractsPageComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

  private prevUIParts: any;

  destroy: Subject<any> = new Subject<any>();

  contracts: Contract[] = [];

  constructor(translate: TranslateService, localizationService: LocalizationService,
              private router: Router,
              private route: ActivatedRoute,
              public workspaceParent: MainWorkspacePageComponent,
              private contractService: ContractsService,
              private parent: MainHomePageComponent,
              public uiParts: UIPartsController) {
    super(translate, localizationService)
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();

    this.uiParts.restoreValue(this.prevUIParts);
  }

  ngOnInit(): void {
    this.prevUIParts = this.uiParts.storeValue();

    this.getContracts();
  }

  ngAfterViewInit(): void {
    this.parent.activateTab(HomePages.Contracts);
  }

  private getContracts() {
      const email = this.workspaceParent.user.email;

      this.contractService.getContractsByEmail(email!)
          .pipe(takeUntil(this.destroy))
          .subscribe(contracts => {
              this.contracts = [...contracts];
          })
  }
}
