/* import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuthBase } from './Models/user-auth-base';
import { UserService } from './services/user.service';
import { ShoppingCartService } from './shopping-cart/shopping-cart.service';
import { FormGroup, FormControl,FormBuilder, Validators, MinLengthValidator } from '@angular/forms';
import { Address } from './Models/address';

export let browserRefresh = false;


import { Department } from './department/department/department';
import { Category } from './category/category';
import { DepartmentService } from './department/department.service';
import { CategoryService } from './category/category.service';


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
  deliveryAddress: string= '';
  errorMessage: string = '';

  departments: Department[]= [];
  categories: Category[]= [];

  adressForm:FormGroup;
  address: Address = new Address();
  addressString: string = "";

  constructor(private securityService: UserService, private router: Router, private shoppingCartService: ShoppingCartService,
     private departmentService: DepartmentService, private categoryService: CategoryService, private fb:FormBuilder){
      this.adressForm=this.fb.group({
        //PhoneNumber:['',Validators.required],
        Street:['', Validators.required],   
        City:['', Validators.required], 
        State:['', Validators.required],    
        ZipCode:['',Validators.required]   
        });  

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
    

    if(this.securityObject.Email == ''){
      this.totalCartItems = 0;
      this.deliveryAddress = '';
    }else{
      this.shoppingCartService.getShoppingCarts(this.securityObject?.Email).subscribe({
        next: shoppingCartItems => {
          this.totalCartItems = 0;
          shoppingCartItems.forEach(element => {
            this.totalCartItems = this.totalCartItems + element.Quantity;
               
          }); 
         // this.totalCartItems= shoppingCartItems.length;
        },
        error: err => {
          this.errorMessage = err;
          console.log(err)
        }
      }) ;
      this.getTotalItem();
      this.getSecurityObject();
      this.getAddress();
      this.getDeliveryAdress();
    }


this.getDepartments();
this.getCategories();
  }
  
  ngOnDestroy(): void {
    this.subscriptionRefresh.unsubscribe();
  }
  
  addAddress(){
    //this.address = this.adressForm.value;
      const p= {...this.address, ...this.adressForm.value};
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
        
        this.securityService.getAddress(this.securityObject.Email).subscribe()
      }

   getTotalItem(){
     this.shoppingCartService.getTotalCartItem().subscribe({
      next: total => this.totalCartItems = total,
      error: err => this.errorMessage = err
     }) 
   } 

   getDeliveryAdress(){
    this.securityService.getDeliveryAddress().subscribe({
     next: address => this.deliveryAddress = address.City + ' ' + address.ZipCode,
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

   getDepartments(){
    this.departmentService.getDepartments().subscribe({
      next: departments => {
        this.departments = departments;
      },
      error : err => {
        this.errorMessage = err,
        console.log(err)
      }
    });
  }

  getCategories(){
    this.categoryService.getCategories().subscribe({
  next: categories =>{
        this.categories = categories;
      },
    error : err => {
      this.errorMessage = err,
      console.log(err) }    
    });
  }
  logOut(){
    localStorage.clear(); 
    this.securityService.logOut();
    this.securityObject.init(); 
    localStorage.clear(); 
    
    //localStorage.clear();
    this.totalCartItems = 0;

  }
}
 */

import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuthBase } from './Models/user-auth-base';
import { UserService } from './services/user.service';
import { ShoppingCartService } from './shopping-cart/shopping-cart.service';
import { FormGroup, FormControl,FormBuilder, Validators, MinLengthValidator } from '@angular/forms';
import { Address } from './Models/address';

export let browserRefresh = false;


import { Department } from './department/department/department';
import { Category } from './category/category';
import { DepartmentService } from './department/department.service';
import { CategoryService } from './category/category.service';


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
  deliveryAddress: string= '';
  errorMessage: string = '';

  departments: Department[]= [];
  categories: Category[]= [];

  adressForm:FormGroup;
  address: Address = new Address();
  addressString: string = "";

  constructor(private securityService: UserService, private router: Router, private shoppingCartService: ShoppingCartService,
     private departmentService: DepartmentService, private categoryService: CategoryService, private fb:FormBuilder){
      this.adressForm=this.fb.group({
        //PhoneNumber:['',Validators.required],
        Street:['', Validators.required],   
        City:['', Validators.required], 
        State:['', Validators.required],    
        ZipCode:['',Validators.required]   
        });  

    this.subscriptionRefresh = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
  });

  

    let auth = undefined;
    let value = localStorage.getItem("AuthObject");

    this.totalCartItems = 0;
    this.deliveryAddress = '';

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
    this.getDeliveryAdress();


this.getDepartments();
this.getCategories();
  }
  
  ngOnDestroy(): void {
    this.subscriptionRefresh.unsubscribe();
  }
  
  addAddress(){
    //this.address = this.adressForm.value;
      const p= {...this.address, ...this.adressForm.value};
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
        
        this.securityService.getAddress(this.securityObject.Email).subscribe()
      }

   getTotalItem(){
     this.shoppingCartService.getTotalCartItem().subscribe({
      next: total => this.totalCartItems = total,
      error: err => this.errorMessage = err
     }) 
   } 

   getDeliveryAdress(){
    this.securityService.getDeliveryAddress().subscribe({
     next: address => this.deliveryAddress = address.City + ' ' + address.ZipCode,
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

   getDepartments(){
    this.departmentService.getDepartments().subscribe({
      next: departments => {
        this.departments = departments;
      },
      error : err => {
        this.errorMessage = err,
        console.log(err)
      }
    });
  }

  getCategories(){
    this.categoryService.getCategories().subscribe({
  next: categories =>{
        this.categories = categories;
      },
    error : err => {
      this.errorMessage = err,
      console.log(err) }    
    });
  }
  logOut(){
    this.securityService.logOut();
    this.securityObject=this.securityService.securityObject;
  //  this.securityObject = null;
    
    //localStorage.clear();
    this.totalCartItems = 0;

  }
}
