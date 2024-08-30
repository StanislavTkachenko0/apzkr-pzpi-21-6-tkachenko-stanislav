import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalizedComponent} from "../../../../shared/other/translation-loader-config";
import {LocalizationService} from "../../../../services/localization.service";
import {UIPartsController} from "../../../../services/ui-parts-controller.service";
import {MenuItem} from "primeng/api";
import {AdminPages} from "../../shared/enums/Pages";

@Component({
  selector: 'main-admin-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

  private prevUIParts: any;

  destroy: Subject<any> = new Subject<any>();

  tabItems!: MenuItem[];
  activeItem!: MenuItem;

  constructor(translate: TranslateService, localizationService: LocalizationService,
              private router: Router,
              private route: ActivatedRoute,
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
        label: this.localizationService.getLanguage() === 'en' ? 'Startups' : 'Стартапи',
        icon: 'pi pi-align-left',
        fragment: 'startups',
        routerLinkActiveOptions: { relativeTo: this.route }
      },
      {
        label: this.localizationService.getLanguage() === 'en' ? 'News' : 'Новини',
        icon: 'pi pi-at',
        fragment: 'news',
        routerLinkActiveOptions: { relativeTo: this.route }
      },
      // {
      //   label: this.localizationService.getLanguage() === 'en' ? 'Events' : 'Події',
      //   icon: 'pi pi-clock',
      //   fragment: 'events',
      //   routerLinkActiveOptions: { relativeTo: this.route }
      // },
    ];

    this.activeItem = this.tabItems[0];
  }

  onActiveItemChange(tab: MenuItem) {
    this.router.navigate([tab.fragment],
      {
        relativeTo: tab.routerLinkActiveOptions.relativeTo,
        queryParams: this.route.snapshot.queryParams
      });
  }

  activateTab(page: AdminPages) {
    this.activeItem = {};

    this.tabItems.forEach(item => {
      if (item.fragment === page) { this.activeItem = item; }
    });
  }
}
