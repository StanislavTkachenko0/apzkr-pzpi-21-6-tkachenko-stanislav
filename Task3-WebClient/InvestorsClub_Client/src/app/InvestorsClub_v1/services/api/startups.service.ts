import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {StartupModel} from "../../shared/models/startup-model";
import {Review} from "../../shared/models/review.model";

@Injectable()
export class StartupsService {

  constructor(private http: HttpClient,
              private router: Router,
              @Inject('API_URL') private apiUrl: string,
              private route: ActivatedRoute) {
  }

  public getStartupsByEmail(email: any): Observable<any> {

    return this.http.post(`${this.apiUrl}api/Business`, null, {
      params: {
        email
      }
    });
  }

  public getAverageOfStartup(startupId: number): Observable<any> {
      return this.http.post(`${this.apiUrl}api/Business/ReviewAverage`, null, {
          params: {
              startupId
          }
      })
  }

  public createReviewForStartup(review: Review): Observable<any> {
      return this.http.post(`${this.apiUrl}api/Business/AddReview`, review);
  }

  public getStartupsByFounder(userId: number): Observable<any> {
      return this.http.post(`${this.apiUrl}api/Business/GetByFounder`, null, {
          params: {
              id: userId
          }
      })
  }

  public deleteStartupById(startupId: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}api/Business/DeleteBusiness`, {
          params: {
              startupId
          }
      })
  }

    public editStartup(startup: StartupModel): Observable<any> {
        return this.http.put(`${this.apiUrl}api/Business/EditBusiness`, startup)
    }

  public createStartup(startup: StartupModel): Observable<any> {
      return this.http.post(`${this.apiUrl}api/Business/Add`, startup);
  }
}
