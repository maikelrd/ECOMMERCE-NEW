import { Component, OnInit, ɵɵsetComponentScope } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription,  } from 'rxjs';
import { IProduct } from 'src/app/products/products';
import { ProductService } from 'src/app/products/product.service';
import { ShoppingCartService } from '../shopping-cart.service';
import { IShoppingCart } from './shopping-cart';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
   products: IProduct[] = [];  
  //products: IProduct[] = [];

  product:IProduct | undefined;
  shoppingCartItems: IShoppingCart[]=[];
  errorMessage: string ='';
  userEmail: string='';
  totalItems: number = 0;

  constructor(private route: ActivatedRoute, private productService: ProductService, private shoppingCartService: ShoppingCartService, private router: Router) { 
    let auth = undefined;
    let value = localStorage.getItem("AuthObject");
    if(value){
      auth=JSON.parse(value);
      this.userEmail=JSON.parse(JSON.stringify(auth.Email));

    }
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if(param){
      //this.router.navigate(['shopping-cart']);
      const id = +param;   
      this.getProduct(id);
    //  this.createCartItem(this.product, this.userEmail);
      
      
     // this.getTotalItem()
     
    }
    else{
      this.getShoppingCarts();
    }
  }

 /* getTotalItem(){
  this.shoppingCartService.getTotalCartItem().subscribe({
    next: total => this.totalItems = total,
    error: err => this.errorMessage = err
   })
 } */

  getProduct(id: number){
    this.productService.getProduct(id).subscribe({
      next: product =>{
        this.product=product;
        this.createCartItem(this.product, this.userEmail);        
      }   ,                   
      error: err => this.errorMessage= err
    });
  }

  getShoppingCarts(){
    this.shoppingCartService.getShoppingCarts(this.userEmail).subscribe({
      next: shoppingCartItems => {
        this.shoppingCartItems = shoppingCartItems;
       /*  this.totalItems = 0;

         this.shoppingCartItems.forEach(element => {
          this.totalItems++
        }); */ 
      },
      error: err => {
        this.errorMessage = err;
        console.log(err)
      }
    })
  }

  createCartItem(product: IProduct, email: string){
   this.shoppingCartService.createCartItem(product, email).subscribe({
    next: data=> {
      console.log(data);    
    this.getShoppingCarts();
  },
    error: err=> {
      this.errorMessage = err,
      console.log(err)
    }
   })
  }

  update(shoppingCart : IShoppingCart){
    this.shoppingCartService.updateShoppingCart(shoppingCart).subscribe({
      
    })
  }
  checkOut(){}

  clearShoppingCart(){}

  deleteProduct(){}

}
