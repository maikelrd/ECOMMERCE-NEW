import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable,throwError,  of, BehaviorSubject, catchError,tap, Subject} from 'rxjs';
import { } from 'rxjs/operators';
import { UserAuthBase } from '../Models/user-auth-base';
import { UserBase } from '../Models/user-base';
import { IProduct } from '../products/products';
import { User } from '../Models/user';
import { subscriptionLogsToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Router } from '@angular/router';

import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { ConfigurationService } from '../shared/configuration/configuration.service';
import { Address } from '../Models/address';
import { Card } from '../Models/card';




@Injectable({
  providedIn: 'root'
})
export class UserService {
  securityObject:UserAuthBase=new UserAuthBase();
  private hasChanged= new BehaviorSubject<number>(0);
  private  url:string=""
  apiUrl: string = "";
  private refreshTokenUrl = "https://localhost:44386/api/Users/RefreshToken";

  private securityObject$: Subject<UserAuthBase|undefined> ;
  private deliveryAddress$: Subject<Address> ;
  
  constructor(private http:HttpClient, private router: Router, private shoppingCartService: ShoppingCartService, private configService: ConfigurationService) {
    this.securityObject$ = new Subject();
    this.deliveryAddress$ = new Subject();
    this.apiUrl = this.configService.setting.apiUrl;
  }



  public register(firstName:string|null,lastName:string|null,email:string|null, password:string|null, isAdmin: boolean|null): Observable<any>{
    const body={
      FirstName:firstName,
      LastName: lastName,
      Email:email,
      Password:password
    }
    const headers= new HttpHeaders({'Content-type': 'application/json'});
   // return this.httpClient.post("https://localhost:44305/api/user/RegisterUser",body).pipe(
    
   // return this.http.post("https://localhost:44386/api/users/RegisterUser",body,{headers}).pipe(
    if(!isAdmin){
     this.url= this.apiUrl + "Users/RegisterUser"
    }else{
      this.url = this.apiUrl + "Users/register-admin"
    }
    return this.http.post(this.url,body,{headers}).pipe(
      tap(resp=>{
       
          //Use object assign to update the current object
          //NOTE: Don't create a new AppUserAuth object
          //      because that destroys all reference to object
          console.log("user registered");  
         // this.hasChanged.next(0);
       
      },Error=>{
        console.log("Error", console.error);       
       
      })

    )
  }

  public login(email:string, password:string):Observable<any>{
    const body={
      Email:email,
      Password:password
    }
    const headers= new HttpHeaders({'Content-type': 'application/json'});
    //return this.http.post("https://localhost:44386/api/Security/Login",body).pipe(
      this.url = this.apiUrl + "Users/Login";
     // return this.http.post("https://localhost:44386/api/Users/Login",body).pipe(
      return this.http.post(this.url,body).pipe(
      tap(resp=>{
       
          //Use object assign to update the current object
          //NOTE: Don't create a new AppUserAuth object
          //      because that destroys all reference to object
         
          Object.assign(this.securityObject,resp);
          //adding this below in order to show the user in appcomponent.html
          this.securityObject$.next(this.securityObject);
          //Inform everyone that a new login has occurred
          this.hasChanged.next(0);
       
      },Error=>{
        console.log("Error", console.error);       
       
      })
    )  
  }

  public PostAddress(address: Address):Observable<any>{
    
    const headers= new HttpHeaders({'Content-type': 'application/json'});
    //return this.http.post("https://localhost:44386/api/Security/Login",body).pipe(
      this.url = this.apiUrl + "Users/Address";
     // return this.http.post("https://localhost:44386/api/Users/Address",address).pipe(
      return this.http.post(this.url,address).pipe(
      tap(resp=>{     
           console.log(resp);       
      },Error=>{
        console.log("Error", console.error);       
       
      })
    )  
  }

  public getAddress(Email: string):Observable<Address>{
    
    const headers= new HttpHeaders({'Content-type': 'application/json'});
    //const url=`https://localhost:44386/api/Users/Email?Email=${Email}`;
    const url=`${this.apiUrl}Users/Email?Email=${Email}`;
      return this.http.get<Address>(url).pipe(
      tap(resp=>{            
        this.deliveryAddress$.next(resp);
        //Inform everyone that a new login has occurred
        this.hasChanged.next(0);
           console.log(resp);       
      },Error=>{
        console.log("Error", console.error);       
       
      })
    )  
  }

  getDeliveryAddress(): Observable<Address>{
    return this.deliveryAddress$.asObservable();
  }

 /*  public PostCard(card: Card):Observable<any>{
    
    const headers= new HttpHeaders({'Content-type': 'application/json'});
    this.url = this.apiUrl + "Card/AddCard"
   
      return this.http.post(this.url,card).pipe(
      tap(resp=>{     
           console.log(resp);       
      },Error=>{
        console.log("Error", console.error);       
       
      })
    )  
  } */
  getSecurityObjetct(): Observable<UserAuthBase|undefined>{
    return this.securityObject$.asObservable();
  }
 
  private handleError(err:HttpErrorResponse){
    //in a real world app, we may send the server to some remonte loggin infraestructure
    //instead of just logging it to the console
    let errorMessage='';
    if(err.error instanceof ErrorEvent){
      //A client-side or network error occurred. Handle it accordingly.
      errorMessage=`An error occurred: ${err.error.message};`
    }else{
      //The backend returned a unsuccessful responde code.
      //The reponse body may contain clues as to what went wrong,
      errorMessage=`Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(()=>errorMessage);
}

 

  GenerateRefreshToken() {
    let input = {
      "Token": this.GetToken(),
      "RefreshToken": this.GetRefreshToken()
    }
    this.url = this.apiUrl + "Users/RefreshToken";
   // return this.http.post(this.refreshTokenUrl, input) .pipe(
    return this.http.post(this.url, input) .pipe(
      tap(resp=>{
          this.SaveTokens(resp);
          console.log(resp);
       
      },Error=>{
        console.log("Error", console.error);       
       
      })
    ) ; 
  }

  GetToken() {    
    return localStorage.getItem("token") || '';
  }
  GetRefreshToken() {
    return localStorage.getItem("refreshtoken") || '';
  }

  SaveTokens(tokendata: any) {
    localStorage.setItem('token', tokendata.Token);
    localStorage.setItem('refreshtoken', tokendata.RefreshToken);
  }

  logOut():void{
    this.securityObject.init(); 
  
      //Inform everyone the security object has changed
      this.hasChanged.next(0);
    
      let temp=this.GetToken();
      if(temp == ''){
        alert('Your session expired');
      }
      
     /*  localStorage.removeItem("AuthObject");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshtoken");*/
    localStorage.clear(); 
    this.shoppingCartService.totalCartItem(0);
    this.router.navigateByUrl('/login');
  }

}
