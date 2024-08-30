import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';
import { formatCurrency } from '@angular/common';
import {LocalizationService} from "../../services/localization.service";

@Pipe({
    name: 'customCurrency',
})
export class CustomCurrencyPipe implements PipeTransform {

    constructor(
        @Inject(LOCALE_ID) private locale: string,
        private localizationService: LocalizationService
    ) {}

    transform(value: number): string {
        return this.localizationService.getLanguage() === 'en'
            ? formatCurrency(value, this.locale, '$ ', 'usd')
            : formatCurrency((value * 37), this.locale, '₴ ', 'grn');
    }
}
