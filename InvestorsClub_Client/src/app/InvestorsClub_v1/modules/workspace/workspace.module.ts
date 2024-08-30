import {NgModule} from "@angular/core";
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "../../shared/other/translation-loader-config";
import {HttpClient} from "@angular/common/http";
import {RouterLink, RouterModule} from "@angular/router";
import {MainPageComponent} from "../admin/pages/main-page/main-page.component";
import {StartupsDisplayComponent} from "../admin/components/startups/startups-display.component";
import {NewsDisplayComponent} from "../admin/components/news/news-display.component";
import {EventsDisplayComponent} from "../admin/components/events/events-display.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TabMenuModule} from "primeng/tabmenu";
import {DataViewModule} from "primeng/dataview";
import {TagModule} from "primeng/tag";
import {AccordionModule} from "primeng/accordion";
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";
import {EditorModule} from "primeng/editor";
import {DialogModule} from "primeng/dialog";
import {AutoFocusModule} from "primeng/autofocus";
import {InputTextModule} from "primeng/inputtext";
import {NewsViewModule} from "../../components/news-view/news-view.module";
import {MainWorkspacePageComponent} from "./pages/main-workspace-page/main-workspace-page.component";
import {SidebarModule} from "primeng/sidebar";
import {MenuModule} from "primeng/menu";
import {NewsPageComponent} from "./pages/news-page/news-page.component";
import {StartupsPageComponent} from "./pages/startups-page/startups-page.component";
import {StartupsDataModule} from "../../components/startups-data-view/startups-data.module";
import {NginitModule} from "../../directives/nginit.module";
import {AccessAdminGuard} from "../../guards/access-admin.guard";

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
                path: '', component: MainWorkspacePageComponent,
                children: [
                    {path: '', redirectTo: 'home', pathMatch: 'full'},
                    {
                        path: 'home',
                        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
                    },
                    {
                        path: 'news', component: NewsPageComponent
                    },
                    {
                        path: 'startups', component: StartupsPageComponent
                    },
                    {
                        path: 'admin',
                        loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule),
                        canActivate: [AccessAdminGuard]
                    },
                ]
            },
        ]),

        FormsModule,
        RouterLink,
        TabMenuModule,
        NgClass,
        NgForOf,
        DataViewModule,
        TagModule,
        AccordionModule,
        AvatarModule,
        BadgeModule,
        EditorModule,
        DialogModule,
        AutoFocusModule,
        InputTextModule,
        NgIf,
        ReactiveFormsModule,
        NewsViewModule,
        SidebarModule,
        MenuModule,
        StartupsDataModule,
        NginitModule
    ],
  declarations: [
    MainWorkspacePageComponent,
    NewsPageComponent,
    StartupsPageComponent
  ],
  exports: []
})
export class WorkspaceModule { }
