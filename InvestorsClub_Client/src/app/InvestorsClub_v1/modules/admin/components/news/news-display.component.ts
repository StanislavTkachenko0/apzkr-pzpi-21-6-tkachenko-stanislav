import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {finalize, Subject, take, takeUntil} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalizedComponent} from "../../../../shared/other/translation-loader-config";
import {LocalizationService} from "../../../../services/localization.service";
import {UIPartsController} from "../../../../services/ui-parts-controller.service";
import {NewsService} from "../../../../services/api/news.service";
import {MessageService} from "primeng/api";
import {MainPageComponent} from "../../pages/main-page/main-page.component";
import {AdminPages} from "../../shared/enums/Pages";

@Component({
  selector: 'news-page-display',
  templateUrl: './news-display.component.html'
})
export class NewsDisplayComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

  private prevUIParts: any;

  destroy: Subject<any> = new Subject<any>();

  constructor(translate: TranslateService, localizationService: LocalizationService,
              private router: Router,
              private route: ActivatedRoute,
              private parent: MainPageComponent,
              private toastService: MessageService,
              private newsService: NewsService,
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
    this.parent.activateTab(AdminPages.News);
  }
}
