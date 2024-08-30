import { NgModule } from '@angular/core';
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "../../shared/other/translation-loader-config";
import {HttpClient} from "@angular/common/http";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {NewsViewComponent} from "./news-view.component";
import {AccordionModule} from "primeng/accordion";
import {AvatarModule} from "primeng/avatar";
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {EditorModule} from "primeng/editor";

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
  ],
  declarations: [NewsViewComponent],
  exports: [NewsViewComponent]
})
export class NewsViewModule { }
