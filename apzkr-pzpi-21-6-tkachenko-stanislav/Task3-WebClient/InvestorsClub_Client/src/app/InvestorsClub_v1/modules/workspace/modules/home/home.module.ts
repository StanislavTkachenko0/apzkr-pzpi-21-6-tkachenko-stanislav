import { NgModule } from '@angular/core';
import {AsyncPipe, NgIf, NgTemplateOutlet} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink, RouterModule} from "@angular/router";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {AvatarModule} from "primeng/avatar";
import {MenuModule} from "primeng/menu";
import {HttpLoaderFactory} from "../../../../shared/other/translation-loader-config";
import {MainHomePageComponent} from "./pages/main-home-page/main-home-page.component";
import {TabMenuModule} from "primeng/tabmenu";
import {MyStartupsPageComponent} from "./pages/my-startups-page/my-startups-page.component";
import {InvestmentReqPageComponent} from "./pages/investment-req-page/investment-req-page.component";
import {ContractsPageComponent} from "./pages/contracts-page/contracts-page.component";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {EditorModule} from "primeng/editor";
import {DropdownModule} from "primeng/dropdown";
import {StartupsDataModule} from "../../../../components/startups-data-view/startups-data.module";
import {InvestmentReqModule} from "../../../../components/investment-req-data-view/investment-req.module";
import {ContractsModule} from "../../../../components/contracts-data-view/contracts.module";

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
                path: '', component: MainHomePageComponent,
                children: [
                    {path: '', redirectTo: 'myStartups', pathMatch: 'full'},
                    {
                        path: 'myStartups', component: MyStartupsPageComponent
                    },
                    {
                        path: 'investReq', component: InvestmentReqPageComponent
                    },
                    {
                        path: 'contracts', component: ContractsPageComponent
                    }
                ]
            },
        ]),

        ToggleButtonModule,
        FormsModule,
        RouterLink,
        NgIf,
        OverlayPanelModule,
        AvatarModule,
        MenuModule,
        AsyncPipe,
        TabMenuModule,
        StartupsDataModule,
        DialogModule,
        InputTextModule,
        ReactiveFormsModule,
        EditorModule,
        DropdownModule,
        StartupsDataModule,
        StartupsDataModule,
        InvestmentReqModule,
        ContractsModule,
    ],
  declarations: [
    MainHomePageComponent,
    MyStartupsPageComponent,
    InvestmentReqPageComponent,
    ContractsPageComponent
  ],
  exports: [

  ]
})
export class HomeModule { }
