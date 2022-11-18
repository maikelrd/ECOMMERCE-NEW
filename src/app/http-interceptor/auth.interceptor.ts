import { Injectable, Injector, ɵɵsetComponentScope } from '@angular/core';
import { UserService } from '../services/user.service';
import { tap } from 'rxjs';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private inject: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //let auth = undefined; 
    let authservice =this.inject.get(UserService) ;        
    let authreq = req;
    authreq = this.AddTokenheader(req, authservice.GetToken());
    return next.handle(authreq).pipe(     
      catchError(errordata =>{
        if(errordata.status === 401){
          return this.handleRefreshToken(req, next)
        // authservice.logOut();
        }
        return throwError(errordata)
      })
    )  
       
    
  }
  handleRefreshToken(req: HttpRequest<any>, next: HttpHandler){
    let authservice = this.inject.get(UserService);
    return authservice.GenerateRefreshToken().pipe(
      switchMap((data: any) => {
        authservice.SaveTokens(data);
        return next.handle(this.AddTokenheader(req, data.Token))
      }),
      catchError(errorData => {
        authservice.logOut();
        return throwError(errorData)
      })
    );
  }

  AddTokenheader(request: HttpRequest<any>, token: any) {
    return request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
  };
}
