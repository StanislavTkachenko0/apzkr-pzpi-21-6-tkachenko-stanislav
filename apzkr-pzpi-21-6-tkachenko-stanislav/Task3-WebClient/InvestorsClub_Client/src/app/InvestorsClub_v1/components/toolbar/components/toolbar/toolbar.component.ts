import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {LocalizedComponent} from "../../../../shared/other/translation-loader-config";
import {Subject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {LocalizationService} from "../../../../services/localization.service";
import {AuthService} from "../../../../services/api/auth.service";

@Component({
  selector: 'toolbar',
  templateUrl: 'toolbar.component.html'
})
export class ToolbarComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

  destroy: Subject<any> = new Subject<any>();

  constructor(translate: TranslateService, localizationService: LocalizationService,
              public authService: AuthService) {
    super(translate, localizationService)
  }

  ngOnDestroy(): void {
    this.destroy.complete();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  onChangeLocalization(value: any) {
    this.localizationService.setLanguage(value ? 'ua' : 'en');
  }
}
