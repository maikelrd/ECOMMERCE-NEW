import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable,catchError,tap,throwError, of } from 'rxjs';
import { IProduct } from './products';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productUrl="https://localhost:44386/api/Products";

  constructor(private http:HttpClient) { }

  getProducts():Observable<IProduct[]>{
    return this.http.get<IProduct[]>("https://localhost:44386/api/Products").pipe(
      tap(data=>console.log('All',JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

getProduct(id:number): Observable<IProduct>{
  if(id===0){
    return of(this.initializeProduct());
  }
  const url=`${this.productUrl}/${id}`;
  return this.http.get<IProduct>(url)
   .pipe(
    tap(data=>console.log('getProduct: '+ JSON.stringify(data))),
    catchError(this.handleError)
   );
}

createProduct(product:FormData): Observable<IProduct> {
  const headers= new HttpHeaders({'Content-type': 'application/json'});
 //product.ProductId=0;
 console.log(...product);
  return this.http.post<any>(this.productUrl,product,{headers})
     .pipe(
      tap(data=>console.log('createProduct: '+ JSON.stringify(data))),
      catchError(this.handleError)
     );
}

deleteProduct(id: number): Observable<{}> {
  const headers= new HttpHeaders({ 'Content-Type': 'application/json'});
  const url=`${this.productUrl}/${id}`;
  return this.http.delete<IProduct>(url, {headers})
    .pipe(
       tap(data=>console.log('deleteProduct: '+ id)),
       catchError(this.handleError)
    );
}

updateProduct(product: IProduct): Observable<IProduct> {
  const headers= new HttpHeaders({ 'Content-Type': 'application/json' });
  const url=`${this.productUrl}/${product.ProductId}`;
  return this.http.put<IProduct>(url, product, {headers})
   .pipe(
    tap(()=>console.log('updateProduct: '+ product.ProductId)),
    catchError(this.handleError)
   );
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

  private initializeProduct(): IProduct {
    //Return an initialized object
    return {
    ProductId:0,
    ProductName:'',
    ProductCode:'',
    ReleaseDate:'',
    CategoryId:0,
    UnitPrice:0,
    StockQty:0,
    Description: '',
    StarRating: 0,
    ImageUrl:'',
    //Total:0
    productImages:  []
    
    };
  }
}
