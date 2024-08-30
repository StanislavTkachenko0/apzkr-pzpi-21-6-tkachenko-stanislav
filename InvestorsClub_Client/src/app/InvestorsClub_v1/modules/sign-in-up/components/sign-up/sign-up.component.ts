import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {finalize, Observable, Subject, takeUntil} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {LocalizedComponent} from "../../../../shared/other/translation-loader-config";
import {LocalizationService} from "../../../../services/localization.service";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UIPartsController} from "../../../../services/ui-parts-controller.service";
import {AuthResponseModel, RegisterModel} from "../../../../shared/models/auth-models";
import {AuthService} from "../../../../services/api/auth.service";
import {MessageService} from "primeng/api";
import {Roles} from "../../../../shared/enums/Roles";
import {InvestorType} from "../../../../shared/enums/InvestorType";

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

  private prevUIParts: any;

  destroy: Subject<any> = new Subject<any>();

  form!: FormGroup;
  isLoading!: boolean;
    roles = [
        { name: this.localizationService.getLanguage() === 'en' ? 'Founder' : 'Засновник', code: Roles.User },
        { name: this.localizationService.getLanguage() === 'en' ? 'Investor' : 'Інвестор', code: Roles.Investor }
    ];

    desiredInvestorTypes = [
        { name: this.localizationService.getLanguage() === 'en' ? 'Angel Investor' : 'Ангельський інвестор',
            code: InvestorType.AngelInvestor },
        { name: this.localizationService.getLanguage() === 'en' ? 'State Investor' : 'Державний інвестор',
            code: InvestorType.StateInvestor },
        { name: this.localizationService.getLanguage() === 'en' ? 'Venture Capitalist' : 'Венчурний капіталіст',
            code: InvestorType.VentureCapitalist },
        { name: this.localizationService.getLanguage() === 'en' ? 'Corporate Investor' : 'Корпоративний інвестор',
            code: InvestorType.CorporateInvestor },
        { name: this.localizationService.getLanguage() === 'en' ? 'Crowdfunding Investor' : 'Краудфандинговий інвестор',
            code: InvestorType.CrowdfundingInvestor },
    ]

    Roles = Roles;

  constructor(translate: TranslateService, localizationService: LocalizationService,
              private cdr: ChangeDetectorRef,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private toastService: MessageService,
              public uiParts: UIPartsController,
  ) {
    super(translate, localizationService)
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();

    this.uiParts.restoreValue(this.prevUIParts);
  }

  ngOnInit(): void {
    this.prevUIParts = this.uiParts.storeValue();

    this.initForm();
  }

  ngAfterViewInit(): void {
  }

  private initForm() {
    this.form = new FormGroup<any>({
      email: new FormControl(null, [
        Validators.email,
        Validators.required
      ]),
      password: new  FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.pattern('^\\S+$')
      ], [
        this.matchPasswordAsync.bind(this)
      ]),
        role: new FormControl(null, [Validators.required]),
        investorType: new FormControl(0, []),
        budget: new FormControl(null, [])
    })
  }

  matchPasswordAsync(control: AbstractControl): Promise<{ [key: string]: any } | null> | Observable<{ [key: string]: any } | null> {
    const password = control.parent?.get('password')!.value;
    const confirmPassword = control.value;

    return password !== confirmPassword
      ? Promise.resolve({ passwordMismatch: true })
      : Promise.resolve(null);
  }

  register() {
    const authInfo: RegisterModel = {
        email: this.form.get('email')?.value,
        password: this.form.get('confirmPassword')?.value,
        role: this.form.get('role')?.value.code,
        investorType: this.form.get('investorType')?.value.code,
        budget: this.form.get('budget')?.value
    }

    this.isLoading = true;
    this.authService.register(authInfo)
      .pipe(
        takeUntil(this.destroy),
        finalize(() => this.isLoading = false),
      )
      .subscribe({
        next: () => {
          this.toastService.add({ severity: 'success', summary: 'Success', detail: 'You have successfully registered' });
          this.router.navigate(['/sign', 'in']).then();
        },
        error: (res) => {
          this.toastService.add({ severity: 'error', summary: 'Error', detail: res.error });
        }
      });
  }
}
