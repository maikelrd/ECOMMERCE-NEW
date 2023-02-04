import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable,catchError,tap,throwError, of , map} from 'rxjs';
import { IProduct } from './products';

import { FileHandle } from './file-handle';
import { IImageModel } from './images-model';
import { DomSanitizer } from '@angular/platform-browser';

import { IFilterModel } from '../Models/filterModel';
import { ConfigurationService } from '../shared/configuration/configuration.service';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productUrl="https://localhost:44386/api/Products";
  private productPageUrl = "https://localhost:44386/api/Pagination";
  private productPageByCategoryUrl: string = "https://localhost:44386/api/PaginationCategory";
  private filterInCategoryUrl = "https://localhost:44386/api/FilterInCategory";
  private filterProductUrl = "https://localhost:44386/api/FilterProducts";

  apiUrl: string = "";
  //url: string = "";

  constructor(private http:HttpClient, private sanitizer: DomSanitizer, private configService: ConfigurationService) { 
    this.apiUrl = this.configService.setting.apiUrl;
  }

  getProducts():Observable<IProduct[]>{
    const url=  this.apiUrl + "Products"
    //return this.http.get<IProduct[]>("https://localhost:44386/api/Products").pipe(
      return this.http.get<IProduct[]>(url).pipe(
      tap(data=>console.log('All',JSON.stringify(data))),
    // map((x: IProduct[], i) => x.map((product:IProduct) => this.createImages(product))),
      catchError(this.handleError)
    );
  }

  getProductsByPage(page: number):Observable<IProduct[]>{    
   // const url =`${this.productPageUrl}/${page}`;
   const url =`${this.apiUrl + "Pagination"}/${page}`;
    return this.http.get<IProduct[]>(url).pipe(
      tap(data=>console.log('All',JSON.stringify(data))),
    // map((x: IProduct[], i) => x.map((product:IProduct) => this.createImages(product))),
      catchError(this.handleError)
    );
  }

  getCountProducts(): Observable<number>{     
    const url = this.apiUrl + "Pagination";
    return this.http.get<number>(url)
     .pipe(
      tap(data=>console.log('count of Products: '+ JSON.stringify(data))),     
      catchError(this.handleError)
     );
  }

  getCountProductsByCategory(categoryId: number): Observable<number>{     
    //const url =`${this.productPageByCategoryUrl}/${categoryId}`
    const url =`${this.apiUrl + "PaginationCategory"}/${categoryId}`;
    return this.http.get<number>(url)
     .pipe(
      tap(data=>console.log('count of Products: '+ JSON.stringify(data))),     
      catchError(this.handleError)
     );
  }

  getProductsByCategoryPage(categoryId: number,page: number):Observable<IProduct[]>{
    const url =`${this.apiUrl + "PaginationCategory"}/${categoryId}/${page}`;
    return this.http.get<IProduct[]>(url).pipe(
      tap(data=>console.log('All',JSON.stringify(data))),
     //map((x: IProduct[], i) => x.map((product:IProduct) => this.createImages(product))),
      catchError(this.handleError)
    );
  }

  /* GetProductsByCategoryFilter(categoryId: number, filterBy: string):Observable<IProduct[]>{
    const url =`${this.filterUrl}/${categoryId}/${filterBy}`;
    return this.http.get<IProduct[]>(url).pipe(
     // tap(data=>console.log('All',JSON.stringify(data))),
     map((x: IProduct[], i) => x.map((product:IProduct) => this.createImages(product))),
      catchError(this.handleError)
    );
  } */
  getCountProductsCategoryFilter(categoryId: number,filterBy: string): Observable<number>{   
   // const url =`${this.filterInCategoryUrl}/${categoryId}/${filterBy}`;  
    const url =`${this.apiUrl + "FilterInCategory"}/${categoryId}/${filterBy}`; 
    return this.http.get<number>(url)
     .pipe(
      tap(data=>console.log('count of Products: '+ JSON.stringify(data))),     
      catchError(this.handleError)
     );
  }

  GetProductsByCategoryFilter(categoryId: number, page: number,filterBy: string):Observable<IProduct[]>{
   // const url =`${this.filterInCategoryUrl}/${categoryId}/${page}/${filterBy}`;
   const url =`${this.apiUrl + "FilterInCategory"}/${categoryId}/${page}/${filterBy}`;
    return this.http.get<IProduct[]>(url).pipe(
      tap(data=>console.log('All',JSON.stringify(data))),
    // map((x: IProduct[], i) => x.map((product:IProduct) => this.createImages(product))),
      catchError(this.handleError)
    );
  }

  getCountProductsFilter(filterBy: string): Observable<number>{   
    //const url =`${this.filterProductUrl}/${filterBy}`;  
    const url =`${this.apiUrl + "FilterProducts"}/${filterBy}`;      
    return this.http.get<number>(url)
     .pipe(
      tap(data=>console.log('count of Products: '+ JSON.stringify(data))),     
      catchError(this.handleError)
     );
  }
  GetProductsFilter(page: number, filterBy: string):Observable<IProduct[]>{
    //const url =`${this.filterProductUrl}/${page}/${filterBy}`;
    const url =`${this.apiUrl + "FilterProducts"}/${page}/${filterBy}`;
    return this.http.get<IProduct[]>(url).pipe(
      tap(data=>console.log('All',JSON.stringify(data))),
     //map((x: IProduct[], i) => x.map((product:IProduct) => this.createImages(product))),
      catchError(this.handleError)
    );
  }


getProduct(id:number): Observable<IProduct>{
  if(id===0){
    return of(this.initializeProduct());
  }
  //const url=`${this.productUrl}/${id}`;
  const url=`${this.apiUrl + "Products"}/${id}`;
  return this.http.get<IProduct>(url)
   .pipe(
    tap(data=>console.log('getProduct: '+ JSON.stringify(data))),
   // map(x =>{return this.createImages(x)}),
    catchError(this.handleError)
   );
}

createProduct(product:FormData): Observable<IProduct> {
  const headers= new HttpHeaders({'Content-type': 'application/json'});
 //product.ProductId=0;
 console.log(...product);
 const url = this.apiUrl + "Products";
  return this.http.post<IProduct>(url,product)
     .pipe(
      tap(data=>console.log('createProduct: '+ JSON.stringify(data))),
      catchError(this.handleError)
     );
}

deleteProduct(id: number): Observable<{}> {
  const headers= new HttpHeaders({ 'Content-Type': 'application/json'});
  //const url=`${this.productUrl}/${id}`;
  const url=`${this.apiUrl + "Products"}/${id}`;
  return this.http.delete<IProduct>(url, {headers})
    .pipe(
       tap(data=>console.log('deleteProduct: '+ id)),
       catchError(this.handleError)
    );
}

updateProduct(product: IProduct): Observable<IProduct> {
  const headers= new HttpHeaders({ 'Content-Type': 'application/json' });
  const url=`${this.apiUrl + "Products"}/${product.ProductId}`;
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
    //Url:'',
    //Total:0
    Images:  []
    
    };
  }


  createImages(product: IProduct): IProduct{
    
    for(let i =0; i<product.Images.length; i++){
      const imageBlob= this.dataUrltoBlob(product.Images[i].PicByte, product.Images[i].Type);
 
     const imageFile= new File([imageBlob], product.Images[i].Name, {type: product.Images[i].Type});
 
     const finalFileHandle :FileHandle ={
       file: imageFile,
       url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
     };
     product.Images[i].fileHandle = finalFileHandle;
     
    }
     return product;
   }
 
   dataUrltoBlob(picBytes:string,imageType:string): Blob{
     const byteString= window.atob(picBytes);
     const arrayBuffer = new ArrayBuffer(byteString.length);
     const int8Array = new Uint8Array(arrayBuffer);
 
     for(let i=0; i<byteString.length; i++){
       int8Array[i]= byteString.charCodeAt(i);
     }
     const blob = new Blob([int8Array], {type: imageType});
     return blob;
   }

  
}
