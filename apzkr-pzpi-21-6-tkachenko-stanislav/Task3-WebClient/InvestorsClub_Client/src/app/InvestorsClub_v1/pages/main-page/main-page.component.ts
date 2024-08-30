import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LocalizationService} from "../../services/localization.service";
import {LocalizedComponent} from "../../shared/other/translation-loader-config";

@Component({
  selector: 'main-v1-page',
  templateUrl: 'main-page.component.html'
})
export class MainPageComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

  constructor(translate: TranslateService, localizationService: LocalizationService) {
    super(translate, localizationService)
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }
}
