import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/Models/card';
import { UserService } from 'src/app/services/user.service';
import { PaymentService } from 'src/app/services/payment.service';
import { UserAuthBase } from 'src/app/Models/user-auth-base';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, FormBuilder, Validators, MinLengthValidator, FormArray, AbstractControl } from '@angular/forms';

declare var window: any;

function validCardNumber(c:AbstractControl):{[key:string]:boolean}|null{
  const cardControl=c.value; 

  if(cardControl?.pristine){
    return null;
  }
 // 3 American Express, 4 Visa, 5 MasterCards, 6 Discover.
  if(!((cardControl.charAt(0) == '3') || (cardControl.charAt(0) == '4') || (cardControl.charAt(0) == '5') || (cardControl.charAt(0) == '6'))){
   return {'onlyNumber':true};
  }

  if((!/[a-zA-Z]/.test(cardControl)) && (cardControl.length == 16 )){
    return null;
  }
 
  return {'onlyNumber':true};
} 

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})



export class WalletComponent implements OnInit {
  formModalAdd: any;
  formModalEdit: any;
  defaultPMethod: boolean = false;
  cardUseToPay: Card = new Card();
  cardForm: FormGroup;
  card: Card = new Card();
  cards: Card[] = []
  securityObject: UserAuthBase = new UserAuthBase();
  errorMessage: string = '';

  
  constructor(private fb:FormBuilder,private securityService: UserService, private paymentService: PaymentService) {
    this.cardForm =  this.fb.group({
      CardNumber: ['', validCardNumber],
      NameOnCard: ['', Validators.required],
      ExpMonth: ['', Validators.required],
      ExpYear: ['', Validators.required],
      DefaultPMethod: [false, Validators.required]
    })
   }

  ngOnInit(): void {
    //used later to show o hide the Modal
    this.formModalEdit = new window.bootstrap.Modal(
      document.getElementById('editCardModal'));

      this.formModalAdd = new window.bootstrap.Modal(
        document.getElementById('addCardModal'));
    
    let auth = undefined;
    let value = localStorage.getItem("AuthObject");
    if (value){
      this.securityObject = JSON.parse(value);      
    }

    this.getCards();
  }

  editPayment(card: Card){
    console.log(card)
    this.card = card;
    this.cardForm.patchValue({
      CardNumber: card.CardNumber,
      NameOnCard: card.NameOnCard,      
      ExpMonth: card.ExpMonth,
      ExpYear: card.ExpYear,
      DefaultPMethod: card.DefaultPMethod
          
    })
    //delete below
     const c = {...this.card, ...this.cardForm.value};
     console.log(this.defaultPMethod);
    console.log(c); 
  }

  updateCard(){
    if(this.cardForm.valid){
      if(this.cardForm.dirty){
        const c = {...this.card, ...this.cardForm.value};
        c.Email = this.securityObject.Email;
        this.paymentService.updateCard(c).subscribe({
          next: data => {
            console.log(data);
            this.formModalEdit.hide();            
            this.getCards();
          },
          error: err => this.errorMessage = err
        })
      }
    }
  }
  
  getCards(){   
    this.paymentService.getCards(this.securityObject.Email).subscribe({
     next: data=>{
      this.errorMessage = '';
      this.cards = data ;
      this.defaultPMethod = false;
    this.cards.forEach(element => {
        element.lastDigits = element.CardNumber.substring(12, 16);
        switch(element.CardNumber.charAt(0)){
          case '3': element.Type = 'American Express';
          break;
          case '4': element.Type = 'Visa';
          break;
          case '5': element.Type = 'Mastercards';
          break;
          case '6': element.Type = 'Discover';
          break;
          default: element.Type = 'Unknow'
          break;
        } 
        
        if(element.DefaultPMethod == true){
          this.defaultPMethod = true;
          this.cardUseToPay= element;
        }
       
      });

      this.cards.forEach(element => {
        if(element.DefaultPMethod == this.defaultPMethod){
          element.ShowDefaultP = true;
        }
        else{
          element.ShowDefaultP = false ;
        }
      });
       console.log(data);
     },
     error: err => this.errorMessage = err.error
    })
   }

  addCard(){
   const p = {...this.card, ...this.cardForm.value};
   p.Email = this.securityObject.Email;
   if(this.defaultPMethod == false){
    this.defaultPMethod = p.DefaultPMethod;
   }
   this.paymentService.PostCard(p).subscribe({
    next: data=>{
      this.getCards();
     this.cardForm.reset();
     //const p = {...this.card, ...this.cardForm.value};
     this.errorMessage = ''
      console.log(data);
      //this.getCards();
    },
    error: err => this.errorMessage = err.error
   })
  }
 getSecurityObject(){
    this.securityService.getSecurityObjetct().subscribe({
     next: securityObject =>{
      if(securityObject){
       this.securityObject = securityObject;
      }
     },      
      error: err => this.errorMessage = err
   }) 
  }

  removePayment(){
    if (confirm(`Really want to delete this card`)){
      if(this.card.DefaultPMethod == true){
        this.defaultPMethod = false;
      }
      this.paymentService.deleteCard(this.card.CardId).subscribe({
        next:()=>{
          console.log('deleting card');        
         this.formModalEdit.hide();
          this.getCards();
        },
        error: err=>this.errorMessage= err
      });
    }
  }
}
