import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription,  } from 'rxjs';
import { IProduct } from 'src/app/products/products';
import { ProductService } from 'src/app/products/product.service';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
   productss: IProduct[] = [{
    ProductId:1,
    ProductName:'tv',
    ProductCode:'tv 32 "',
    ReleaseDate:'',
    CategoryId:0,
    UnitPrice:4,
    StockQty:2,
    Description: 'Tv 32 inches',
    StarRating: 5,
    ImageUrl:'/assets/images/711qRHKMRTL._AC_UY218_.jpg',
    Total:340
  },
  {
    ProductId:1,
    ProductName:'tv',
    ProductCode:'tv 32 "',
    ReleaseDate:'',
    CategoryId:0,
    UnitPrice:4,
    StockQty:2,
    Description: 'Tv 32 inches',
    StarRating: 5,
    ImageUrl:'/assets/images/711qRHKMRTL._AC_UY218_.jpg',
    Total:340
  }];  
  //products: IProduct[] = [];

  product:IProduct | undefined;

  errorMessage: string ='';
  userEmail: string='';

  constructor(private route: ActivatedRoute, private productService: ProductService, private shoppingCartService: ShoppingCartService) { 
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
      const id = +param;   
      this.getProduct(id);
      /* if(this.product){
        this.createCartItem(this.product, this.userEmail);
      } */
      
    }
  }

  getProduct(id: number){
    this.productService.getProduct(id).subscribe({
      next: (product: IProduct) =>{
        this.product=product;
        this.createCartItem(this.product, this.userEmail);
      }   ,                   
      error: err => this.errorMessage= err
    });
  }

  createCartItem(product: IProduct, email: string){
   this.shoppingCartService.createCartItem(product, email).subscribe({
    next: data=> console.log(data),
    error: err=> {
      this.errorMessage = err,
      console.log(err)
    }
   })
  }
  checkOut(){}

  clearShoppingCart(){}

  deleteProduct(){}

}
