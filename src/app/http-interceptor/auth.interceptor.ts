import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let auth = undefined;    
    let value = localStorage.getItem("AuthObject");
   
    if (value){
      auth = JSON.parse(value);
    }

    if(auth){
        const authReq = req.clone({
          setHeaders:{'Authorization':`Bearer ${JSON.parse(JSON.stringify(auth.Token))}`}
        });
        return next.handle(authReq)
    }else{
      return next.handle(req);
    }
    
  }
}
