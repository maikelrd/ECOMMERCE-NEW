import { Component, OnInit, Input, ɵɵsetComponentScope  } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Observable, Subscription, filter} from 'rxjs';
import { IProduct } from 'src/app/products/products';
import { ProductService } from 'src/app/products/product.service';
import { ShoppingCartService } from '../shopping-cart.service';
import { IShoppingCart } from './shopping-cart';

import { IProductShoppingCart } from '../productShoppingCart';
//import { IProductShoppingCart } from '../productInShoppingCart';

import { browserRefresh } from 'src/app/app.component';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
 // @Input() productId: number = 0;
 public browserRefresh: boolean = false;

  prodCartId: number = 0;
   products: IProduct[] = [];  
  //products: IProduct[] = [];

  product:IProduct | undefined;
  //shoppingCart: IShoppingCart;
  shoppingCart: IShoppingCart={ShoppingCartId: 0,
    UserEmail:"",
    ProductsInShoppingCart:[{
      ProductShoppingCart: {ProductId:0, ProductCode:'', ProductName:'',UnitPrice:0,StockQty:0, StarRating:0, ReleaseDate:'', Description:'', Images:[], CategoryId:0},
      Quantity: 1
    }],
    Total:0
  } ;
  errorMessage: string ='';
  userEmail: string='';
  totalItems: number = 0;
  amount: number= 0;
  totalToPay: number = 0;
  subTotalToPay: number = 0;
  fee: number = 0;
  shipping = 10;
  disableButton: boolean = false;  //To active o desactive the button of clear your shopping cart

  totalCartItems: number = 0;

   productShoppingCart: IProductShoppingCart[]=[];


  constructor(private route: ActivatedRoute, private productService: ProductService, private shoppingCartService: ShoppingCartService, 
                                            private router: Router) { 
    let auth = undefined;
    let value = localStorage.getItem("AuthObject");
    if(value){
      auth=JSON.parse(value);
      this.userEmail=JSON.parse(JSON.stringify(auth.Email));

    }
    
  }

   

  ngOnInit(): void {
   
   this.browserRefresh = browserRefresh;
   //if is a refresh do not increment de product amaount
   if(!this.browserRefresh)
   {
    var param = this.route.snapshot.paramMap.get('id');  
    if(param){      
      const id = +param;   
      this.getProduct(id);
    }     
   }
   this.getShoppingCarts();
    this.getTotalItem()
   
  }


 getTotalItem(){
  this.shoppingCartService.getTotalCartItem().subscribe({
    next: total =>{ 
      
        if( total == 0){
          this.disableButton = true;
      }else{
        this.disableButton = false;
      }
    },
    error: err => this.errorMessage = err
   })
 }

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
      next: productsShoppingCart => {
        this.productShoppingCart = productsShoppingCart;
        this.totalToPay = 0;
        this.subTotalToPay = 0;
        this.totalCartItems = 0;
          this.productShoppingCart.forEach(element => {
          element.Total= element.Product.UnitPrice * element.Quantity;
          this.subTotalToPay = this.subTotalToPay + element.Total;
          this.totalCartItems = this.totalCartItems + element.Quantity;
        });  
        this.fee = this.subTotalToPay *0.10;
        this.totalToPay = this.subTotalToPay + this.fee + this.shipping;
        //Hago lo de abajo para evitar tener ruta http://localhost:4200/shopping-cart/1 o el Id del shoppigCart, y cuando le doy f5 a la pagina crea un nuevo Item
       // this.router.navigate(['shopping-cart']);
      },
      error: err => {
        this.errorMessage = err;
        console.log(err)
      }
    })
  }
 
/*   getShoppingCart(id: number){
    this.shoppingCartService.getShoppingCart(id).subscribe({
      next: shoppingCartItem =>{
        this.amount = shoppingCartItem.Amount;
      },
      error: err =>{
        this.errorMessage = err;
        console.log(err);
      }
    })
  } */
  createCartItem(product: IProduct, email: string){
   this.shoppingCartService.createCartItem(product, email).subscribe({
    next: data=> {
      console.log(data);    
      //this.shoppingCart = data;
    this.getShoppingCarts();
  },
    error: err=> {
      this.errorMessage = err,
      console.log(err)
    }
   })
  }

  update(productShoppingCart: IProductShoppingCart){
    
    this.shoppingCartService.updateShoppingCart(productShoppingCart).subscribe({
      next: data =>{ 
        console.log(data);
        this.getShoppingCarts();
      },
      error: err =>{
        this.errorMessage = err;
        console.log(err);
      }
    });
  }

  deleteShoppingCartItem(productShoppingCartId: number): any{
   this.shoppingCartService.deleteShoppingCarItem(productShoppingCartId).subscribe({
    next: data =>{
      console.log(data);
      this.getShoppingCarts();
      },
    error: err => this.errorMessage = err
   });
  }

  clearShoppingCart(){
    this.shoppingCartService.clearShoppingCart(this.userEmail).subscribe({
      next: data =>{
        console.log(data);
        this.getShoppingCarts();
      },
      error: err =>this.errorMessage = err
    });
  }

  checkOut(){}

 

 

}
