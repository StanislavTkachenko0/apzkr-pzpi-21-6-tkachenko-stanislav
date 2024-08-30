import {AfterViewInit, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {LocalizedComponent} from "../../shared/other/translation-loader-config";
import {finalize, Subject, takeUntil} from "rxjs";
import {PostNews} from "../../shared/models/post-news-model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {LocalizationService} from "../../services/localization.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {NewsService} from "../../services/api/news.service";
import {UIPartsController} from "../../services/ui-parts-controller.service";

@Component({
  selector: 'news-view',
  templateUrl: './news-view.component.html'
})
export class NewsViewComponent extends LocalizedComponent implements OnInit, AfterViewInit, OnDestroy{

  private prevUIParts: any;

  destroy: Subject<any> = new Subject<any>();

  @Input()
  isAdmin!: boolean;

  news!: PostNews[];
  form!: FormGroup;
  visibleDialog = false;
  isLoading!: boolean;

  constructor(translate: TranslateService, localizationService: LocalizationService,
              private router: Router,
              private route: ActivatedRoute,
              private toastService: MessageService,
              private newsService: NewsService,
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

    this.initForm()
    this.getNews();
  }

  ngAfterViewInit(): void {
  }

  getNews() {
    this.newsService.getNews()
      .pipe(takeUntil(this.destroy))
      .subscribe((n: PostNews[]) => {
        this.news = n;
      })
  }

  private initForm() {
    this.form = new FormGroup<any>({
      headline: new FormControl(null, [
        Validators.required
      ]),
      text: new FormControl(null, [
      ]),
      photoUrl: new FormControl(null, [])
    })
  }

  onOpenCreateNews() {
    this.visibleDialog = true;
  }

  onCreateNews() {
    const post: PostNews = {
      startupId: undefined,
      headline: this.form.get('headline')?.value,
      text: this.form.get('text')?.value,
      photoUrl: this.form.get('photoUrl')?.value,
      publicationDate: new Date()
    }

    this.isLoading = true;
    this.newsService.createNews(post)
      .pipe(takeUntil(this.destroy))
      .pipe(finalize(() => {
        this.visibleDialog = false;
        this.isLoading = false;
      }))
      .subscribe(res => {
        if(res) {
          this.toastService.add({ severity: 'success', summary: 'Success', detail: 'You have successfully created new post' });

          this.getNews();
        }
      })
  }

  onDeleteNews(post: PostNews) {
    post['isLoading'] = true;

    this.newsService.deleteNews(post.id!)
      .pipe(takeUntil(this.destroy))
      .pipe(finalize(() => post['isLoading'] = false))
      .subscribe(res => {
        this.toastService.add({ severity: 'success', summary: 'Success', detail: 'You have successfully deleted a post' });
        this.onRemovedItem(post);
      });
  }

  onRemovedItem(item: PostNews) {
    const foundItem: PostNews = this.news.find(w => w.id === item.id)!;
    const indexOf = this.news.indexOf(foundItem);
    if (indexOf >= 0) {
      this.news.splice(indexOf, 1);
      this.news = [...this.news];
    }
  }
}
