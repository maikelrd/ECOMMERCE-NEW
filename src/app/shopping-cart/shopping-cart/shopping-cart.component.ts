import { Component, OnInit, ɵɵsetComponentScope  } from '@angular/core';
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
  amount: number= 0;
  totalToPay: number = 0;
  subTotalToPay: number = 0;
  fee: number = 0;
  shipping = 10;
  disableButton: boolean = false;  //To active o desactive the button of clear your shopping cart

  totalCartItems: number = 0;



  constructor(private route: ActivatedRoute, private productService: ProductService, private shoppingCartService: ShoppingCartService, 
                                            private router: Router) { 
    let auth = undefined;
    let value = localStorage.getItem("AuthObject");
    if(value){
      auth=JSON.parse(value);
      this.userEmail=JSON.parse(JSON.stringify(auth.Email));

    }
    
  }

 /*  ngOnChanges(changes: SimpleChanges): void {
    {
      this.getShoppingCarts();
    }
  } */
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
    this.getTotalItem()
  }


 getTotalItem(){
  this.shoppingCartService.getTotalCartItem().subscribe({
    next: total =>{ 
      this.totalCartItems = total;
      //To active o desactive the button of clear your shopping cart
      if( this.totalCartItems == 0){
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
      next: shoppingCartItems => {
        this.shoppingCartItems = shoppingCartItems;
        this.totalToPay = 0;
        this.subTotalToPay = 0;
         this.shoppingCartItems.forEach(element => {
          element.Total= element.Product.UnitPrice * element.Amount;
          this.subTotalToPay = this.subTotalToPay + element.Total;
        }); 
        this.fee = this.subTotalToPay *0.10;
        this.totalToPay = this.subTotalToPay + this.fee + this.shipping;
        //Hago lo de abajo para evitar tener ruta http://localhost:4200/shopping-cart/1 o el Id del shoppigCart, y cuando le doy f5 a la pagina crea un nuevo Item
        this.router.navigate(['shopping-cart']);
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
    this.getShoppingCarts();
  },
    error: err=> {
      this.errorMessage = err,
      console.log(err)
    }
   })
  }

  update(shoppingCartItem: IShoppingCart){
    
    this.shoppingCartService.updateShoppingCart(shoppingCartItem).subscribe({
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

  deleteShoppingCartItem(shoppingCartItemId: number): any{
   this.shoppingCartService.deleteShoppingCarItem(shoppingCartItemId).subscribe({
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
