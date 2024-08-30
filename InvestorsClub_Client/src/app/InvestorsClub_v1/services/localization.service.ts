import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {timer} from "rxjs";

@Injectable()
export class LocalizationService {
  localizationKey = 'investor_localization';
  defaultLanguage = 'en';

  flagLang!: boolean;
  onChangeLangProcess!: boolean;

  constructor(private translate: TranslateService) {
  }

  public getLanguage(): string {
    const lng = localStorage.getItem(this.localizationKey);

    return lng ? lng : this.defaultLanguage
  }

  public setLanguage(language: 'en' | 'ua') {
    this.onChangeLangProcess = true;
    localStorage.setItem(this.localizationKey, language);
    this.translate.use(language)

    setTimeout(() => this.onChangeLangProcess = false, 500)
  }
}
