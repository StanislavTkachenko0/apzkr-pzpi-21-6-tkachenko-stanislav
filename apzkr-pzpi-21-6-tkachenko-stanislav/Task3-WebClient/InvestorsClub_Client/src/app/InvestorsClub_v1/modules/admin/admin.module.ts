import { NgModule } from '@angular/core';
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "../../shared/other/translation-loader-config";
import {HttpClient} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink, RouterModule} from "@angular/router";
import {MainPageComponent} from "./pages/main-page/main-page.component";
import {TabMenuModule} from "primeng/tabmenu";
import {StartupsDisplayComponent} from "./components/startups/startups-display.component";
import {NewsDisplayComponent} from "./components/news/news-display.component";
import {EventsDisplayComponent} from "./components/events/events-display.component";
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
import {StartupsDataModule} from "../../components/startups-data-view/startups-data.module";

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
                path: '', component: MainPageComponent,
                children: [
                    {path: '', redirectTo: 'startups', pathMatch: 'full'},
                    {
                        path: 'startups', component: StartupsDisplayComponent
                    },
                    {
                        path: 'news', component: NewsDisplayComponent
                    },
                    {
                        path: 'events', component: EventsDisplayComponent
                    }
                ]

            }
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
        StartupsDataModule,
    ],
  declarations: [
    MainPageComponent,
    StartupsDisplayComponent,
    NewsDisplayComponent,
    EventsDisplayComponent
  ],
  exports: []
})
export class AdminModule { }
