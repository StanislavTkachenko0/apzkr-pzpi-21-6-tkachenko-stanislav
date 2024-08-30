import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import { jwtDecode } from "jwt-decode";
import {ACCESS_TOKEN_KEY} from "./auth.service";
import {Roles} from "../../shared/enums/Roles";

@Injectable()
export class UserService {

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject('API_URL') private apiUrl: string,
    private route: ActivatedRoute
  ) {
  }

  getUser(id?: number): Observable<any> {
    return this.http.get(`${this.apiUrl}api/Users/${!!id ? id : this.getUserInfoFromToken().userId}`);
  }

  changePassword(oldPassword: string, newPassword: string) : Observable<any> {
    const userId = this.getUserInfoFromToken().userId;

    const data = {
      userId: userId,
      oldPassword: oldPassword,
      newPassword: newPassword
    };

    return this.http.post(`${this.apiUrl}api/User/changePassword`, data);
  }

  getUserInfoFromToken(): any {
    const jwtToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const tokenInfo = this.getDecodedAccessToken(jwtToken!);

    return {
      username: tokenInfo.name,
      userId: +tokenInfo.userId,
      role: tokenInfo.role
    };
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  // updateUser(user: UpdateUserModel) : Observable<any> {
  //   return this.http.put(`${this.apiUrl}api/User/update`, user);
  // }

  deleteUser(userId: number) : Observable<any> {
    return this.http.delete(`${this.apiUrl}api/User/${userId}`);
  }

  bannedUser(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}api/User/ban/${userId}`, userId)
  }

}
