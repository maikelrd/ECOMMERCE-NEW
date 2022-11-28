import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { UserService } from 'src/app/services/user.service';
import { UserAuthBase } from 'src/app/Models/user-auth-base';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl,FormBuilder, Validators, MinLengthValidator } from '@angular/forms';
import { Address } from 'src/app/Models/address';
import { IProductShoppingCart } from '../productShoppingCart';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  totalItems: number = 0;
  totalToPay: number = 0;
  subTotalToPay: number = 0;
  fee: number = 0;
  shipping = 10;

  securityObject: UserAuthBase = new UserAuthBase()// | undefined;
  subscription :Subscription | undefined;
  totalCartItems: number = 0;
  errorMessage: string = '';

  addressForm:FormGroup;
  address: Address = new Address();
  addressString: string = "";

  deliveryAddress: string= '';

  productShoppingCart: IProductShoppingCart[]=[];

  constructor(private shoppingCartService: ShoppingCartService, private securityService: UserService, private fb:FormBuilder) {
    this.addressForm=this.fb.group({
      //PhoneNumber:['',Validators.required],
      Street:['', Validators.required],   
      City:['', Validators.required], 
      State:['', Validators.required],    
      ZipCode:['',Validators.required]   
      });   
   }

  ngOnInit(): void {
    let auth = undefined;
    let value = localStorage.getItem("AuthObject");
    if (value){
      this.securityObject = JSON.parse(value);
      
    }
   
    this.shoppingCartService.getShoppingCarts(this.securityObject?.Email).subscribe({
      next: shoppingCartItems => {
        //this.totalCartItems= shoppingCartItems.length;
      },
      error: err => {
        this.errorMessage = err;
        console.log(err)
      }
    })
    this.getSubTotal();
    this.getTotalItem();
    this.getAddress();
    this.getDeliveryAdress();
    this. getShoppingCarts();
  }
  
  addAddress(){
  //this.address = this.adressForm.value;
    const p= {...this.address, ...this.addressForm.value};
    p.Email = this.securityObject.Email;
    this.securityService.PostAddress(p).subscribe({
    next: data =>{
      console.log(data);
      this.getAddress();
    },
    error: err => this.errorMessage = err
    })
  }

  getAddress(){
    //this.address = this.adressForm.value;
      
      this.securityService.getAddress(this.securityObject.Email).subscribe({
      next: data =>{
        this.address = data;
        this.addressString = this.address.Street + ' ' +this.address.City + ' ' + this.address.State + ' ' + this.address.ZipCode;
        console.log(this.address)
      },
      error: err => this.errorMessage = err
      })
    }

    getDeliveryAdress(){
      this.securityService.getDeliveryAddress().subscribe({
       next: address => this.deliveryAddress = address.Street + ' '+address.City + ' '+address.State + ' ' + address.ZipCode,
       error: err => this.errorMessage = err
      }) 
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
  getSubTotal(){
    this.shoppingCartService.getSubtotal().subscribe({
      next: subtotal => {
        this.subTotalToPay = subtotal;
        this.fee = this.subTotalToPay *0.10;
        this.totalToPay = this.subTotalToPay + this.fee + this.shipping;
      } ,
      error: err => this.errorMessage = err
    })
  }

  getShoppingCarts(){
    this.shoppingCartService.getShoppingCarts(this.securityObject.Email).subscribe({
      next: productsShoppingCart => {
        this.productShoppingCart = productsShoppingCart;
        
        
        //Hago lo de abajo para evitar tener ruta http://localhost:4200/shopping-cart/1 o el Id del shoppigCart, y cuando le doy f5 a la pagina crea un nuevo Item
       // this.router.navigate(['shopping-cart']);
      },
      error: err => {
        this.errorMessage = err;
        console.log(err)
      }
    })
  }
}
