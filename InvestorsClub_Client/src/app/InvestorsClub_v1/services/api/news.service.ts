import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {PostNews} from "../../shared/models/post-news-model";

@Injectable()
export class NewsService {

  constructor(private http: HttpClient,
              private router: Router,
              @Inject('API_URL') private apiUrl: string,
              private route: ActivatedRoute) {
  }

  getNews(): Observable<PostNews[]> {
    return this.http.get<PostNews[]>(`${this.apiUrl}api/News/news`)
  }

  createNews(post: PostNews): Observable<PostNews> {
    return this.http.post<PostNews>(`${this.apiUrl}api/News/news`, post);
  }

  deleteNews(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}api/News/${id}`)
  }
}
