import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

// AuthGuard provides methods that the Angular router can call before it redirects
@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state:  RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    // If we return true, that will mean that the route the router is trying to access is accessible
    const isAuth = this.authService.getType();
    if(isAuth === 0 || isAuth === 1 || isAuth === 2){
      return true;
    }else{
      this.router.navigate(['/login']);
      return false;
    }

  }


}
