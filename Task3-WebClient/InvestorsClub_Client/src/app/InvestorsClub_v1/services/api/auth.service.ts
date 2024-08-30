import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {API_URL} from "../../../app-injections-tokens";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthResponseModel} from "../../shared/models/auth-models";
import {JwtHelperService} from "@auth0/angular-jwt";

export const ACCESS_TOKEN_KEY = 'investors_club_token'

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient,
        @Inject('API_URL') private apiUrl: string,
        private jwtHelper: JwtHelperService,
        private router: Router,
        private route: ActivatedRoute
    )
    {}

    register(authInfo: AuthResponseModel): Observable<any> {
        return this.http.post(`${this.apiUrl}api/Auth/register`, authInfo)
    }

    login(authInfo: AuthResponseModel): Observable<any> {
        return this.http.post(`${this.apiUrl}api/Auth/login`, authInfo)
            .pipe(tap((res: any) => {
                localStorage.setItem(ACCESS_TOKEN_KEY, res.token);
            }))
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        return !this.jwtHelper.isTokenExpired(token) && !!token;
    }

    logout() {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        this.router.navigate(['sign', 'in'], { relativeTo: this.route }).then();
    }
}
