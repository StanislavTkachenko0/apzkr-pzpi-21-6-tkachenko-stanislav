import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {catchError, finalize, of, Subject, takeUntil} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {LocalizedComponent} from "../../../../shared/other/translation-loader-config";
import {LocalizationService} from "../../../../services/localization.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UIPartsController} from "../../../../services/ui-parts-controller.service";
import {MessageService} from "primeng/api";
import {AuthService} from "../../../../services/api/auth.service";
import {AuthResponseModel} from "../../../../shared/models/auth-models";
import {ErrorStatuses} from "../../../../shared/enums/ErrorStatuses";
import {HashService} from "../../../../services/api/hash.service";

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html'
})
export class SignInComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

  destroy: Subject<any> = new Subject<any>();

  form!: FormGroup;
  isLoading!: boolean;
  private prevUiParts: any;

  constructor(translate: TranslateService, localizationService: LocalizationService,
              private router: Router,
              private route: ActivatedRoute,
              public uiParts: UIPartsController,
              private authService: AuthService,
              private hashService: HashService,
              private toastService: MessageService) {
    super(translate, localizationService)

  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();

    this.uiParts.restoreValue(this.prevUiParts);
  }

  ngOnInit(): void {
    this.prevUiParts = this.uiParts.storeValue();

    this.initForm()
  }

  ngAfterViewInit(): void {
  }

  private initForm() {
    this.form = new FormGroup<any>({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required
      ])
    })
  }

  login() {
    const authInfo: AuthResponseModel = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value
    }

    this.isLoading = true;
    this.authService.login(authInfo)
      .pipe(
        takeUntil(this.destroy),
        finalize(() => this.isLoading = false),
        catchError(error => {
          if (error.status === ErrorStatuses.FORBIDDEN) {
            this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Your Account was banned. Please write to support' });
            return of(null);
          }

          this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Incorrect email or password' });
          return of(null);
        })
      )
      .subscribe((w) => {
        if(w !== null) {
          this.toastService.add({ severity: 'success', summary: 'Success', detail: 'You have successfully logged in' });

          const secretKey = this.getRecursiveSecretKey(w.user);

          this.router.navigate([`/workspace/${secretKey}`]).then();
        }
      })
  }

  getRecursiveSecretKey(user: any): any {
    const key = this.hashService.encrypt(user.email);

    return key.includes('/') ? this.getRecursiveSecretKey(user) : key;
  }
}
