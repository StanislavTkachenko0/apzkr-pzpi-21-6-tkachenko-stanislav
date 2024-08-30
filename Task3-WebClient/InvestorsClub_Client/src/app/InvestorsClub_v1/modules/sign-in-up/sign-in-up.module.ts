import { NgModule } from '@angular/core';
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "../../shared/other/translation-loader-config";
import {HttpClient} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {SignInComponent} from "./components/sign-in/sign-in.component";
import {SignUpComponent} from "./components/sign-up/sign-up.component";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";

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

        RouterModule.forChild([
            {
                path: '', redirectTo: 'in', pathMatch: 'full'
            },
            {
                path: 'in', component: SignInComponent
            },
            {
                path: 'up', component: SignUpComponent
            }
        ]),

        FormsModule,
        CardModule,
        InputTextModule,
        ReactiveFormsModule,
        NgIf,
        DropdownModule,
    ],
  declarations: [
    SignInComponent,
    SignUpComponent
  ],
  exports: []
})
export class SignInUpModule { }
