import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";

@Injectable()
export class InvestorService {

    constructor(private http: HttpClient,
                private router: Router,
                @Inject('API_URL') private apiUrl: string,
                private route: ActivatedRoute) {
    }

    getInvestorByEmail(email: string): Observable<any> {
        return  this.http.get(`${this.apiUrl}api/Investors/Investor`, {
            params: {
                email
            }
        })
    }
}
