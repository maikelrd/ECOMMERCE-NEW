import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError, of, Subject } from 'rxjs';
import { IShoppingCart } from './shopping-cart/shopping-cart';
import { IProduct } from '../products/products';

import { IProductShoppingCart } from './productShoppingCart';
// {IProductShoppingCart} from "src/app/shopping-cart"
//import {ShoppingCartService as LazyServiceInterface}
//import { Resolve } from '@angular/router';


@Injectable(
  {
  providedIn: 'root'
}
)
export class ShoppingCartService {
 private cartUrl = "https://localhost:44386/api/ShoppingCart";
 private shoppingCartUrl = "https://localhost:44386/api/Shopping_Cart"
 private productShoppingCartUrl = "https://localhost:44386/api/ProductsShoppingCart"

 shoppingCartItems: IShoppingCart[]=[];
 shoppingCart: IShoppingCart ={ShoppingCartId: 0,
                                UserEmail:"",
                                ProductsInShoppingCart:[{
                                  ProductShoppingCart: {ProductId:0, ProductCode:'', ProductName:'',UnitPrice:0,StockQty:0, StarRating:0, ReleaseDate:'', Description:'', Images:[], CategoryId:0},
                                  Quantity: 1
                                }],
                                Total:0
                              } ;
 //shoppingCartItem: IShoppingCart | undefined;
 totalItems: number = 0;
 private totalCartItem$: Subject<number>;
 subTotal: number = 0;
 private subtotal$: Subject<number>;
 
  constructor(private http: HttpClient) { 
    this.totalCartItem$ = new Subject();
    this.subtotal$ = new Subject();

  }

  createCartItem(product:IProduct, userEmail: string): Observable<IShoppingCart>{
    const headers= new HttpHeaders({'Content-type': 'application/json'});
    const cartItem = this.InitializeCartItem(product, userEmail);
   return this.http.post<IShoppingCart>(this.shoppingCartUrl, cartItem,{headers})
              .pipe(
                tap(data => console.log('CreateShoppingCartItem' + JSON.stringify(data))),
                catchError(this.handleError)
              );

  }

 /*  getShoppingCarts(userEmail: string): Observable<IShoppingCart[]>{
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
  } */
   getShoppingCarts(userEmail: string): Observable<IProductShoppingCart[]>{
    const headers= new HttpHeaders({'Content-type': 'application/json'});
   // userEmail.replace('@','%40');
    const url=`${this.productShoppingCartUrl}/userEmail?userEmail=${userEmail}`;
    //"https://localhost:44386/api/ShoppingCart/email?email=maikelrd%40gmail.com"
    return this.http.get<IProductShoppingCart[]>(url)
         .pipe(
          tap(data =>{
             console.log('shoppingCarts' +JSON.stringify(data));
         // this.shoppingCartItems = data;
          this.totalItems = 0;
          this.subTotal = 0;
          var productShoppingCart = data;
          productShoppingCart.forEach(element => {
            this.totalItems = this.totalItems + element.Quantity;
             this.subTotal = this.subTotal + element.Quantity*element.Product.UnitPrice;   
          }); 
           /* this.shoppingCartItems.forEach(element => {
            this.totalItems++
          });  */
          this.totalCartItem(this.totalItems);
          this.getTotalCartItem();// check if 
          this.subTotalCartItem(this.subTotal);
          this.getSubtotal();
        }),
          catchError(this.handleError) 
         );
  } 


  totalCartItem(total: number){
    // this.totalCartItem$=this.totalItems;
     this.totalCartItem$.next(total);
   }
 
   getTotalCartItem():Observable<number>{
     return this.totalCartItem$.asObservable();
   }

   subTotalCartItem(subtotal: number){
     this.subtotal$.next(subtotal);
   }
   
   getSubtotal(): Observable<number>{
    return this.subtotal$.asObservable();
   }


   updateShoppingCart(productShoppingCart: IProductShoppingCart):Observable<IProductShoppingCart>{
    const headers= new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.productShoppingCartUrl}/${productShoppingCart.ProductShoppingCartId}`;
    return this.http.put<IProductShoppingCart>(url, productShoppingCart, {headers})
     .pipe(
      tap(() => console.log('updateShoppingCart: ' + productShoppingCart.ProductShoppingCartId)),
      catchError(this.handleError)
     );
   }

   deleteShoppingCarItem(id: number): Observable<any>{
    // super importante esto para evitar este error "Server returned code: 200, error message is: Http failure during parsing for https://localhost:44386/api"
    let headers=  { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), responseType: 'text' as 'json' };
    const url= `${this.productShoppingCartUrl}/${id}`;
    return this.http.delete(url, headers)
    .pipe(
      tap(data => console.log('delete shoppingCartItem: '+ id)),
      catchError(this.handleError)
    )
   }

  clearShoppingCart(userEmail: string){
    let headers=  { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), responseType: 'text' as 'json' };
    const url=`${this.productShoppingCartUrl}/userEmail?userEmail=${userEmail}`;
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
    ShoppingCartId: 0,
    UserEmail: userEmail,
    ProductsInShoppingCart: [{
      ProductShoppingCart: product,
      Quantity: 1
    }],
    Total:0
   
   
     
    
  };
 /*  private InitializeCartItem(product: IProduct, userEmail: string ): IShoppingCart{
    return{
      ShoppingCartItemId: 0,
      Product: product,
      ProductId: product.ProductId,
      Amount: 1,
      UserEmail: userEmail,
      Total: 0
    }; */
  }


}
