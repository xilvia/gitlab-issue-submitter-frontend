import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

 intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getAccessToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization',  'Bearer ' + authToken),
    });
    console.log(authRequest)
    return next.handle(authRequest);
  }
}
