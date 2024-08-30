import { NgModule } from '@angular/core';
import {AsyncPipe, NgIf, NgTemplateOutlet} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "../../shared/other/translation-loader-config";
import {HttpClient} from "@angular/common/http";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {ToolbarComponent} from "./components/toolbar/toolbar.component";
import {UserMenuComponent} from "./components/user-menu/user-menu.component";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {AvatarModule} from "primeng/avatar";
import {MenuModule} from "primeng/menu";

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
    NgIf,
    OverlayPanelModule,
    AvatarModule,
    MenuModule,
    AsyncPipe,
  ],
  declarations: [
    ToolbarComponent,
    UserMenuComponent
  ],
  exports: [ToolbarComponent]
})
export class ToolbarModule { }
