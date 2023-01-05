import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable,throwError,  of, BehaviorSubject, catchError,tap, Subject} from 'rxjs';
import { } from 'rxjs/operators';
import { subscriptionLogsToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Router } from '@angular/router';
import { Card } from '../Models/card';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private  url:string="";
  cardUrl: string = "https://localhost:44386/api/Card"
 
  // private  paymentMethod$: Subject<Card>;
  // private hasChanged= new BehaviorSubject<number>(0);

  constructor(private http:HttpClient, private router: Router) {
    // this.paymentMethod$ = new Subject();
   }  
 

  public getCards(userEmail: string):Observable<Card[]>{
    
    const headers= new HttpHeaders({'Content-type': 'application/json'});
   // https://localhost:44386/api/Card/userEmail?userEmail=maikelrd%40gmail.com
    const url=`https://localhost:44386/api/Card/userEmail?userEmail=${userEmail}`;
      return this.http.get<Card[]>(url).pipe(
      tap(resp=>{   
        console.log(resp)  ;   
       /*  resp.forEach(card =>{
          if(card.DefaultPMethod == true){
            this.paymentMethod$.next(card)
            this.hasChanged.next(0);
          }
        });   */  
        //this.deliveryAddress$.next(resp);
        //Inform everyone that a new login has occurred
       // this.hasChanged.next(0);
           
      },Error=>{
        console.log("Error", console.error);       
       
      })
    )  
  }

 /*  getPaymentMethod(): Observable<Card>{
   return this.paymentMethod$.asObservable();
  } */
  
  public PostCard(card: Card):Observable<any>{
    
    const headers= new HttpHeaders({'Content-type': 'application/json'});
   
      return this.http.post("https://localhost:44386/api/Card/AddCard",card).pipe(
      tap(resp=>{     
           console.log(resp);       
      },Error=>{
        console.log("Error", console.error);       
       
      })
    )  
  }

  updateCard(card: Card): Observable<Card> {
    const headers= new HttpHeaders({ 'Content-Type': 'application/json' });
    const url=`${this.cardUrl}/${card.CardId}`;
    return this.http.put<Card>(url, card, {headers})
     .pipe(
      tap(()=>console.log('updateProduct: '+ card.CardId)),
      catchError(this.handleError)
     );
  }

  deleteCard(cardId: number): Observable<any>{
    const headers= new HttpHeaders({ 'Content-Type': 'application/json'});
    const url=`${this.cardUrl}/${cardId}`;
    return this.http.delete<any>(url, {headers})
      .pipe(
         tap(data=>console.log('deleteCard: '+ cardId)),
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
}
