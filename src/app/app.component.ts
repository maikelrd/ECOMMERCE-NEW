import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuthBase } from './Models/user-auth-base';
import { UserService } from './services/user.service';
import { ShoppingCartService } from './shopping-cart/shopping-cart.service';

//import { ProductListComponent } from './products/product-list/product-list.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pageTitle = 'ECOMMERCE';
  securityObject: UserAuthBase = new UserAuthBase()// | undefined;
  subscription :Subscription | undefined;
  totalCartItems: number = 0;
  errorMessage: string = '';
  constructor(private securityService: UserService, private router: Router, private shoppingCartService: ShoppingCartService){
    let auth = undefined;
    let value = localStorage.getItem("AuthObject");
    if (value){
      this.securityObject = JSON.parse(value);
      
    }
   
    this.shoppingCartService.getShoppingCarts(this.securityObject?.Email).subscribe({
      next: shoppingCartItems => {
        this.totalCartItems= shoppingCartItems.length;
      },
      error: err => {
        this.errorMessage = err;
        console.log(err)
      }
    })
 this.getTotalItem();
  }

   getTotalItem(){
    this.shoppingCartService.getTotalCartItem().subscribe({
      next: total => this.totalCartItems = total,
      error: err => this.errorMessage = err
     })
   } 


  logOut(){
    this.securityService.logOut();
    this.securityObject=this.securityService.securityObject;
    localStorage.removeItem("AuthObject");
    this.totalCartItems = 0;
  }
}
