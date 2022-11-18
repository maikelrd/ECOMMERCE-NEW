import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuthBase } from './Models/user-auth-base';
import { UserService } from './services/user.service';
import { ShoppingCartService } from './shopping-cart/shopping-cart.service';

export let browserRefresh = false;

//import { ProductListComponent } from './products/product-list/product-list.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  subscriptionRefresh: Subscription;

  pageTitle = 'ECOMMERCE';
  securityObject: UserAuthBase = new UserAuthBase()// | undefined;
  subscription :Subscription | undefined;
  totalCartItems: number = 0;
  errorMessage: string = '';
  constructor(private securityService: UserService, private router: Router, private shoppingCartService: ShoppingCartService){
    this.subscriptionRefresh = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
  });


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
this.getSecurityObject();
  }
  
  ngOnDestroy(): void {
    this.subscriptionRefresh.unsubscribe();
  }

   getTotalItem(){
     this.shoppingCartService.getTotalCartItem().subscribe({
      next: total => this.totalCartItems = total,
      error: err => this.errorMessage = err
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


  logOut(){
    this.securityService.logOut();
    this.securityObject=this.securityService.securityObject;
  //  this.securityObject = null;
    
    //localStorage.clear();
    this.totalCartItems = 0;

  }
}
