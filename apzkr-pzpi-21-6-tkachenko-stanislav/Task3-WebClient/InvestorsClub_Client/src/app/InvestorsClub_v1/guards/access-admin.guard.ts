import {map} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable, of, takeUntil} from 'rxjs';
import {AuthService} from "../services/api/auth.service";
import {UserService} from "../services/api/user.service";
import {Roles} from "../shared/enums/Roles";

@Injectable()
export class AccessAdminGuard implements CanActivate {

  constructor(public router: Router,
              private authService: AuthService,
              private userService: UserService,
              private route: ActivatedRoute,) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return of(true);
    this.userService.getUser(this.userService.getUserInfoFromToken().userId)
      .pipe(map((u) => {
        if(this.authService.isAuthenticated() && u.role === Roles.Admin) {
          return true;
        } else {
          this.router.navigate(['/']).then();

          return false;
        }
      }))
  }
}
