import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError, of, Subject } from 'rxjs';
import { IShoppingCart } from './shopping-cart/shopping-cart';
import { IProduct } from '../products/products';
//import {ShoppingCartService as LazyServiceInterface}
//import { Resolve } from '@angular/router';


@Injectable(
  {
  providedIn: 'root'
}
)
export class ShoppingCartService {
 private cartUrl = "https://localhost:44386/api/ShoppingCart";

 shoppingCartItems: IShoppingCart[]=[];
 //shoppingCartItem: IShoppingCart | undefined;
 totalItems: number = 0;
 private totalCartItem$: Subject<number>;
 
  constructor(private http: HttpClient) { 
    this.totalCartItem$ = new Subject();

  }

  createCartItem(product:IProduct, userEmail: string): Observable<IShoppingCart>{
    const headers= new HttpHeaders({'Content-type': 'application/json'});
    const cartItem = this.InitializeCartItem(product, userEmail);
   return this.http.post<IShoppingCart>(this.cartUrl, cartItem,{headers})
              .pipe(
                tap(data => console.log('CreateShoppingCartItem' + JSON.stringify(data))),
                catchError(this.handleError)
              );

  }

  getShoppingCarts(userEmail: string): Observable<IShoppingCart[]>{
    const headers= new HttpHeaders({'Content-type': 'application/json'});
   // userEmail.replace('@','%40');
    const url=`${this.cartUrl}/email?email=${userEmail}`;
    //"https://localhost:44386/api/ShoppingCart/email?email=maikelrd%40gmail.com"
    return this.http.get<IShoppingCart[]>(url)
         .pipe(
          tap(data =>{
             console.log('shoppingCarts' +JSON.stringify(data));
          this.shoppingCartItems = data;
          this.totalItems = 0;
          
           this.shoppingCartItems.forEach(element => {
            this.totalItems++
          }); 
          this.totalCartItem(this.totalItems);
        }),
          catchError(this.handleError) 
         );
  }

/*   getShoppingCart(id: number): Observable<IShoppingCart>{
    const headers= new HttpHeaders({'Content-type': 'application/json'});
    const url = `${this.cartUrl}/${id}`;
    return this.http.get<IShoppingCart>(url)
     .pipe(
      tap(data => {
        console.log('ShoppingCart'+ JSON.stringify(data));   
      }),
      catchError(this.handleError)
     )
  }
 */
  totalCartItem(total: number){
    // this.totalCartItem$=this.totalItems;
     this.totalCartItem$.next(total);
   }
 
   getTotalCartItem():Observable<number>{
     return this.totalCartItem$.asObservable();
   }

   updateShoppingCart(shoppingCart: IShoppingCart):Observable<IShoppingCart>{
    const headers= new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.cartUrl}/${shoppingCart.ShoppingCartItemId}`;
    return this.http.put<IShoppingCart>(url, shoppingCart, {headers})
     .pipe(
      tap(() =>console.log('updateShoppingCart: ' + shoppingCart.ShoppingCartItemId)),
      catchError(this.handleError)
     );
   }

   deleteShoppingCarItem(id: number): Observable<any>{
    // super importante esto para evitar este error "Server returned code: 200, error message is: Http failure during parsing for https://localhost:44386/api"
    let headers=  { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), responseType: 'text' as 'json' };
    const url= `${this.cartUrl}/${id}`;
    return this.http.delete(url, headers)
    .pipe(
      tap(data => console.log('delete shoppingCartItem: '+ id)),
      catchError(this.handleError)
    )
   }

  clearShoppingCart(userEmail: string){
    let headers=  { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), responseType: 'text' as 'json' };
    const url=`${this.cartUrl}/email?email=${userEmail}`;
    return this.http.delete(url, headers)
     .pipe(
      tap(data => console.log('Deleting all ShoppingCartItem of user:'+ userEmail)),
      catchError(this.handleError)
     )
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

  private InitializeCartItem(product: IProduct, userEmail: string ): IShoppingCart{
    return{
      ShoppingCartItemId: 0,
      Product: product,
      ProductId: product.ProductId,
      Amount: 1,
      UserEmail: userEmail,
      Total: 0
    };
  }


}
