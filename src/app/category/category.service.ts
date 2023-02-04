import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError, of } from 'rxjs';
import { Category } from './category';





@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoryUrl = "https://localhost:44386/api/Categories";
  private categoryUrlProducts = "https://localhost:44386/api/Categories";
  

  constructor(private http: HttpClient ) { }
  
  getCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(this.categoryUrl).pipe(
      tap(data =>console.log('All', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getCategory(id : number):Observable<Category>{
    const url = `${this.categoryUrl}/${id}?includeProducts=false`;
    return this.http.get<Category>(url).pipe(
      tap(data => console.log('Category: '+ JSON.stringify(data))),
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



}
