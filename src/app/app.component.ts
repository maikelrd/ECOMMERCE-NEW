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
  securityObject: UserAuthBase | undefined;
  subscription :Subscription | undefined;
  totalCartItems: number = 0;
  errorMessage: string = '';
  constructor(private securityService: UserService, private router: Router, private shoppingCartService: ShoppingCartService){
    this.securityObject=securityService.securityObject;
    // shoppingCartService.totalItems.subscribe;
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
  }
}
