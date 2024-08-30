import {LangChangeEvent, TranslateLoader, TranslateService} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {LocalizationService} from "../../services/localization.service";

export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export class LocalizedComponent {
  constructor(public translate: TranslateService, public localizationService: LocalizationService) {
    const lng = localizationService.getLanguage()

    translate.addLangs(['en', 'ua']);
    this.translate.use(lng);

    this.localizationService.flagLang = lng === 'ua';

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log(event.lang)
      // Дополнительные действия при изменении языка
    });
  }
}
