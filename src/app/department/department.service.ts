import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError, of } from 'rxjs';
import { Department } from './department/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private departmentUrlCategories = "https://localhost:44386/api/Departments?includeCategories=true";
  private departmentUrl = "https://localhost:44386/api/Departments";

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<Department[]>{
    return this.http.get<Department[]>(this.departmentUrlCategories).pipe(
      tap(data => console.log('All', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getDepartment(id: number): Observable<Department>{
    const url=`${this.departmentUrl}/${id}`;
    return this.http.get<Department>(url).pipe(
      tap(data => console.log('Department: ' + JSON.stringify(data))),
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
