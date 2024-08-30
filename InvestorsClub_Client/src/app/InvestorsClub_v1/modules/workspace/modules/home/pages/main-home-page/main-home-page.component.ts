import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalizedComponent} from "../../../../../../shared/other/translation-loader-config";
import {LocalizationService} from "../../../../../../services/localization.service";
import {UIPartsController} from "../../../../../../services/ui-parts-controller.service";
import {MenuItem} from "primeng/api";
import {HomePages} from "../../../../../admin/shared/enums/Pages";
import {MainWorkspacePageComponent} from "../../../../pages/main-workspace-page/main-workspace-page.component";
import {Roles} from "../../../../../../shared/enums/Roles";

@Component({
  selector: 'main-home-page',
  templateUrl: './main-home-page.component.html'
})
export class MainHomePageComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

  private prevUIParts: any;

  destroy: Subject<any> = new Subject<any>();

  tabItems!: MenuItem[];
  activeItem!: MenuItem;

  constructor(translate: TranslateService, localizationService: LocalizationService,
              private router: Router,
              private route: ActivatedRoute,
              private parent: MainWorkspacePageComponent,
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

    this.buildTabItems();
  }

  ngAfterViewInit(): void {
  }

  private buildTabItems() {
    this.tabItems = [
      {
        label: this.localizationService.getLanguage() === 'en' ? 'Investment Requests' : 'Запити на інвестування',
        icon: 'pi pi-file-import',
        fragment: 'investReq',
        routerLinkActiveOptions: { relativeTo: this.route }
      },
      {
        label: this.localizationService.getLanguage() === 'en' ? 'Contracts' : 'Контракти',
        icon: 'pi pi-file',
        fragment: 'contracts',
        routerLinkActiveOptions: { relativeTo: this.route }
      },
    ];

    if(this.parent.user.role !== Roles.Investor) {
        this.tabItems.unshift({
            label: this.localizationService.getLanguage() === 'en' ? 'My Businesses' : 'Мої Бізнеси',
            icon: 'pi pi-align-left',
            fragment: 'myStartups',
            routerLinkActiveOptions: { relativeTo: this.route }
        })
    } else {
        this.router.navigate(['./investReq'], { relativeTo: this.route })
    }

    this.activeItem = this.tabItems[0];
  }

  onActiveItemChange(tab: MenuItem) {
    this.router.navigate([tab.fragment],
      {
        relativeTo: tab.routerLinkActiveOptions.relativeTo,
        queryParams: this.route.snapshot.queryParams
      });
  }

  activateTab(page: HomePages) {
    this.activeItem = {};

    this.tabItems.forEach(item => {
      if (item.fragment === page) { this.activeItem = item; }
    });
  }
}
