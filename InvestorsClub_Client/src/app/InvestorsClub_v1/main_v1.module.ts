import {NgModule, Provider} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CommonModule } from '@angular/common';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MainPageComponent} from "./pages/main-page/main-page.component";
import {RouterModule} from "@angular/router";
import {JwtModule} from "@auth0/angular-jwt";
import {environment} from "../../environments/environments";
import {ACCESS_TOKEN_KEY} from "./services/api/auth.service";
import {ButtonModule} from "primeng/button";
import {ToolbarModule} from "./components/toolbar/toolbar.module";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {IntroductionPageComponent} from "./pages/introduction-page/introduction-page.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "./shared/other/translation-loader-config";
import {sharedProviders} from "./shared/other/shared-providers";
import {ToastModule} from "primeng/toast";
import {AccessAdminGuard} from "./guards/access-admin.guard";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {AuthRequiredGuard} from "./guards/auth-required.guard";
import {ConfirmPopupModule} from "primeng/confirmpopup";

export function tokenGetter() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,

        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),

        RouterModule.forChild([
            {
                path: '', component: MainPageComponent,
                children: [
                    {
                        path: '', redirectTo: 'intro', pathMatch: 'full'
                    },
                    {
                        path: 'intro',
                        component: IntroductionPageComponent
                    },
                    {
                        path: 'sign',
                        loadChildren: () => import('./modules/sign-in-up/sign-in-up.module').then(m => m.SignInUpModule)
                    },
                    {
                        path: 'workspace/:secretKey',
                        loadChildren: () => import('./modules/workspace/workspace.module').then(m => m.WorkspaceModule),
                        canActivate: [AuthRequiredGuard]
                    }
                ]
            }
        ]),

        JwtModule.forRoot({
            config: {
                tokenGetter,
                allowedDomains: environment.tokenWhiteListedDomains
            }
        }),

        ButtonModule,
        ToolbarModule,
        ScrollPanelModule,
        ToastModule,
        ProgressSpinnerModule,
        ConfirmPopupModule,
    ],
  declarations: [
    MainPageComponent,
    IntroductionPageComponent,
  ],
  providers: (sharedProviders as Provider[]).concat([
    AccessAdminGuard,
    AuthRequiredGuard
  ] as Provider[]),
  bootstrap: []
})
export class MainV1Module { }
