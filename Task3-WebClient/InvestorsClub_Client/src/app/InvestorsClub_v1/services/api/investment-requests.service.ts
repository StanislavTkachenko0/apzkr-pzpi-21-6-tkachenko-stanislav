import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {InvestmentReq} from "../../shared/models/investment-req.model";

@Injectable()
export class InvestmentRequestsService {

    constructor(private http: HttpClient,
                private router: Router,
                @Inject('API_URL') private apiUrl: string,
                private route: ActivatedRoute) {
    }

    getInvestmentRequestsByEmail(email: string): Observable<any> {
        return  this.http.post(`${this.apiUrl}api/Transactions/investmentByEmail`, null, {
            params: {
                email
            }
        })
    }

    createInvestmentRequest(invReq: InvestmentReq): Observable<any> {
        return this.http.post(`${this.apiUrl}api/Transactions/createInvestmentReq`, invReq);
    }

    deleteInvestmentReqById(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}api/Transactions/deleteInvestmentReq`, {
            params: {
                id
            }
        })
    }
}
