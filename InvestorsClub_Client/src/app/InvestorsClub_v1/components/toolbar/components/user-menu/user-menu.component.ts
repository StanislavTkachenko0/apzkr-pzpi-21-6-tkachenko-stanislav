import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalizedComponent} from "../../../../shared/other/translation-loader-config";
import {LocalizationService} from "../../../../services/localization.service";
import {UIPartsController} from "../../../../services/ui-parts-controller.service";
import {ConfirmationService, MenuItem} from "primeng/api";
import {AuthService} from "../../../../services/api/auth.service";

@Component({
  selector: 'user-menu',
  templateUrl: './user-menu.component.html'
})
export class UserMenuComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

  @ViewChild('op') op: any;

  private prevUIParts: any;

  destroy: Subject<any> = new Subject<any>();

  public userMenuItems: MenuItem[] = [];
  currentUser!: Observable<any>;

  constructor(translate: TranslateService, localizationService: LocalizationService,
              private router: Router,
              private route: ActivatedRoute,
              private confirmationService: ConfirmationService,
              private authService: AuthService,
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

    this.getUser();
    this.initMenuItems();
  }

  ngAfterViewInit(): void {
  }

  private getUser() {

  }

  private initMenuItems() {
    this.userMenuItems = [
      // {
      //   label: "Profile",
      //   icon: "pi pi-user-edit",
      //   tooltipOptions: {
      //     tooltipLabel: 'Edit your profile information',
      //     tooltipPosition: 'left'
      //   },
      //   command: (ev) => {
      //     this.op.toggle(ev);
      //     this.router.navigate(["./profile"], { relativeTo: this.route });
      //   }
      // },
      {
        label: "Log out",
        icon: "pi pi-user-minus",
        tooltipOptions: {
          tooltipLabel: 'Log out from account',
          tooltipPosition: 'left'
        },
        command: (ev) => {
          this.confirmationService.confirm({
            target: ev.originalEvent.target as EventTarget,
            message: 'Are you sure you want to log out??',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.op.toggle(ev);
              this.authService.logout();
              this.router.navigate(["/"], { relativeTo: this.route });
            }
          });
        }
      },
    ];
  }
}
