import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, switchAll, switchMap, takeUntil} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalizedComponent} from "../../../../shared/other/translation-loader-config";
import {LocalizationService} from "../../../../services/localization.service";
import {UIPartsController} from "../../../../services/ui-parts-controller.service";
import {StartupModel} from "../../../../shared/models/startup-model";
import {StartupsService} from "../../../../services/api/startups.service";
import {UserService} from "../../../../services/api/user.service";
import {User} from "../../../../shared/models/user-models";
import {map} from "rxjs/operators";

@Component({
  selector: 'startups-display',
  templateUrl: './startups-display.component.html'
})
export class StartupsDisplayComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

  private prevUIParts: any;

  destroy: Subject<any> = new Subject<any>();

  startups: StartupModel[] = [];
  user!: User;

  constructor(translate: TranslateService, localizationService: LocalizationService,
              private router: Router,
              private route: ActivatedRoute,
              private startupsService: StartupsService,
              private userService: UserService,
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

    this.getStartups();
  }

  ngAfterViewInit(): void {
  }

  private getStartups() {
      const userId = this.userService.getUserInfoFromToken().userId;


      this.userService.getUser(userId)
          .pipe(takeUntil(this.destroy))
          .pipe(switchMap((u: User) => {
              return  this.startupsService.getStartupsByEmail(u.email)
                  .pipe(map(startups => ({startups, user: u})))
          }))
          .subscribe(obj => {
              this.user = obj.user;
              this.startups = obj.startups;
          });
  }
}
