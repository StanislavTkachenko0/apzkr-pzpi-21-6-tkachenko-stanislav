import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, switchMap, takeUntil} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalizedComponent} from "../../../../shared/other/translation-loader-config";
import {LocalizationService} from "../../../../services/localization.service";
import {UIPartsController} from "../../../../services/ui-parts-controller.service";
import {StartupsService} from "../../../../services/api/startups.service";
import {HashService} from "../../../../services/api/hash.service";
import {StartupModel} from "../../../../shared/models/startup-model";
import {UserService} from "../../../../services/api/user.service";
import {MainWorkspacePageComponent} from "../main-workspace-page/main-workspace-page.component";
import {Roles} from "../../../../shared/enums/Roles";

@Component({
  selector: 'startups-page',
  templateUrl: './startups-page.component.html'
})
export class StartupsPageComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

  private prevUIParts: any;

  destroy: Subject<any> = new Subject<any>();

  startups: StartupModel[] = [];

  constructor(translate: TranslateService, localizationService: LocalizationService,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private startupService: StartupsService,
              private hashService: HashService,
              public parent: MainWorkspacePageComponent,
              public uiParts: UIPartsController) {
    super(translate, localizationService)
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();

    this.uiParts.restoreValue(this.prevUIParts);
  }

  ngOnInit(): void {
    this.prevUIParts = this.uiParts.storeValue();
    this.getAllStartups();
  }

  ngAfterViewInit(): void {
  }

  private getAllStartups() {
      let email = null;

      if(this.parent.user.role == Roles.Investor) {
          const secretKey = this.route.snapshot.parent?.params['secretKey'];
          email = this.hashService.decrypt(secretKey);
      }

      this.startupService.getStartupsByEmail(email)
          .pipe(takeUntil(this.destroy))
          .subscribe(s => {
            this.startups = [...s];
          })
  }
}
