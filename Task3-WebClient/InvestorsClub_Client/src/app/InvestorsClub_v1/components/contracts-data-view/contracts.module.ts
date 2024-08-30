import { NgModule } from '@angular/core';
import {CurrencyPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "../../shared/other/translation-loader-config";
import {HttpClient} from "@angular/common/http";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {AccordionModule} from "primeng/accordion";
import {AvatarModule} from "primeng/avatar";
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {EditorModule} from "primeng/editor";
import {DataViewModule} from "primeng/dataview";
import {RatingModule} from "primeng/rating";
import {TagModule} from "primeng/tag";
import {PanelModule} from "primeng/panel";
import {MenuModule} from "primeng/menu";
import {CustomCurrencyModule} from "../../pipes/currency/custom-currency.module";
import {ContractsDataViewComponent} from "./components/contracts-data-view.component";

@NgModule({
    imports: [
        NgTemplateOutlet,
        ButtonModule,

        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        ToggleButtonModule,
        FormsModule,
        RouterLink,
        AccordionModule,
        AvatarModule,
        NgIf,
        TooltipModule,
        DialogModule,
        ReactiveFormsModule,
        InputTextModule,
        EditorModule,
        NgForOf,
        DataViewModule,
        RatingModule,
        NgClass,
        TagModule,
        PanelModule,
        MenuModule,
        CurrencyPipe,
        CustomCurrencyModule,
    ],
  declarations: [ContractsDataViewComponent],
  exports: [ContractsDataViewComponent]
})
export class ContractsModule { }
