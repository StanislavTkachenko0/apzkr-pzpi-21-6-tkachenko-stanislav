import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Contract, CreateContractModel} from "../../shared/models/contract.model";
import {Statuses} from "../../shared/enums/Statuses";

@Injectable()
export class ContractsService {

    constructor(private http: HttpClient,
                private router: Router,
                @Inject('API_URL') private apiUrl: string,
                private route: ActivatedRoute) {
    }

    getContractsByEmail(email: string): Observable<any> {
        return  this.http.post(`${this.apiUrl}api/Transactions/contractByEmail`, null, {
            params: {
                email
            }
        })
    }

    createContract(contract: CreateContractModel): Observable<any> {
        return  this.http.post(`${this.apiUrl}api/Transactions/createContract`, contract)
    }

    deleteContractById(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}api/Transactions/deleteContract`, {
            params: {
                id
            }
        })
    }

    updateContractStatus(id: number, status: Statuses): Observable<any> {
        return this.http.put(`${this.apiUrl}api/Transactions/updateContract`, null, {
            params: {
                id,
                status
            }
        })
    }
}
