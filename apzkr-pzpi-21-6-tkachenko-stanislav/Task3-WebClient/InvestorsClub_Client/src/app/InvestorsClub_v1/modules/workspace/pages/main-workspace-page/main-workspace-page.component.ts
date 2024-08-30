import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalizedComponent} from "../../../../shared/other/translation-loader-config";
import {LocalizationService} from "../../../../services/localization.service";
import {UIPartsController} from "../../../../services/ui-parts-controller.service";
import {HashService} from "../../../../services/api/hash.service";
import {MenuItem} from "primeng/api";
import {Sidebar} from "primeng/sidebar";
import {UserService} from "../../../../services/api/user.service";
import {User} from "../../../../shared/models/user-models";
import {Roles} from "../../../../shared/enums/Roles";

@Component({
  selector: 'main-workspace-page',
  templateUrl: './main-workspace-page.component.html'
})
export class MainWorkspacePageComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

  @ViewChild('sidebar') sidebar!: Sidebar;

  private prevUIParts: any;

  destroy: Subject<any> = new Subject<any>();

  user!: User;
  sidebarVisible!: boolean;
  sidebarItems!: MenuItem[];

  constructor(translate: TranslateService, localizationService: LocalizationService,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private hashService: HashService,
              public uiParts: UIPartsController,) {
    super(translate, localizationService)
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();

    this.uiParts.restoreValue(this.prevUIParts);
  }

  ngOnInit(): void {
    this.prevUIParts = this.uiParts.storeValue();

    this.userService.getUser(this.userService.getUserInfoFromToken().userId)
        .pipe(takeUntil(this.destroy))
        .subscribe(u => {
            this.user = u;

            this.buildSidebarItems();
        })
  }

  ngAfterViewInit(): void {
  }

  private buildSidebarItems() {
    this.sidebarItems = [
      {
        label: this.localizationService.getLanguage() === 'en' ? 'Home' : 'Додому',
        icon: 'pi pi-home',
        command: (ev) => {
          this.router.navigate(['home'], { relativeTo: this.route }).then(() => {
            this.sidebar.close(ev.originalEvent)
          });
        }
      },
      {
        label: this.localizationService.getLanguage() === 'en' ? 'Businesses' : 'Бізнеси',
        icon: 'pi pi-align-left',
        command: (ev) => {
          this.router.navigate(['startups'], { relativeTo: this.route }).then(() => {
            this.sidebar.close(ev.originalEvent)
          });
        }
      },
      {
        label: this.localizationService.getLanguage() === 'en' ? 'News' : 'Новини',
        icon: 'pi pi-at',
        command: (ev) => {
          this.router.navigate(['news'], { relativeTo: this.route }).then(() => {
            this.sidebar.close(ev.originalEvent)
          });
        }
      },
      // {
      //   label: this.localizationService.getLanguage() === 'en' ? 'Events' : 'Події',
      //   icon: 'pi pi-clock',
      //   command: (ev) => {
      //
      //   }
      // },
    ];

    if(this.user.role === Roles.Admin){
        this.sidebarItems.push(
            {
                label: this.localizationService.getLanguage() === 'en' ? 'Admin panel' : 'Адмін панель',
                icon: 'pi pi-lock',
                command: (ev) => {
                    this.router.navigate(['admin'], { relativeTo: this.route }).then(() => {
                        this.sidebar.close(ev.originalEvent)
                    });
                }
            }
        );
    }
  }
}
