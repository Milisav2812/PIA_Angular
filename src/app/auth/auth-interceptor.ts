import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

  constructor(private authService: AuthService){}

  // An interceptor works like a middleware, except it is used for outgoing requests
  intercept(req: HttpRequest<any>, next: HttpHandler){
    const authToken = this.authService.getToken();

    // Creating a copy of the request
    // A copy must be created because of the way requests are handled
    const authRequest = req.clone({
      // .set() will just attach a header
      // Must be the same name as in out backend middleware
      // The "Bearer " can be omitted, its just a convencion
      headers: req.headers.set('Authorization', "Bearer " + authToken)
    });

    return next.handle(authRequest);
  }

}
