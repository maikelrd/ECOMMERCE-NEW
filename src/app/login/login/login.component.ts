import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { UserService } from 'src/app/services/user.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';   
import { UserService } from 'src/app/services/user.service';
import { UserAuthBase } from 'src/app/Models/user-auth-base';

import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  securityObject: UserAuthBase|undefined;
  errorString: string="";
  returnUrl: string|undefined;
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(private fb:FormBuilder, private userService:UserService, private router:Router, private route:ActivatedRoute,
                                     private toastr: ToastrService, private shoppingCartService: ShoppingCartService) {
     this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['',Validators.required]
    })
   }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl')!;
  }


  showHidePassword(){
    this.showPassword = !this.showPassword;
  }

  login(){
    console.log('on submit');
    this.securityObject?.init();
    let email = this.loginForm.controls["email"].value;
    let password = this.loginForm.controls["password"].value;
    this.userService.login(email,password).subscribe((resp:any)=>{
      if(resp){
        localStorage.setItem('token', resp.Token);
        localStorage.setItem('refreshtoken', resp.RefreshToken);
        localStorage.setItem("AuthObject",JSON.stringify(resp));
        this.securityObject = resp;
        this.errorString = "";
        this.loginForm.reset();
        //this to update the amount of item of the shoppingcart in the app.component and show it 
        this.getShoppingCarts();
        //this to update the delivery address  in the app.component and show it 
        this.getAddress();

        if(this.returnUrl){
          this.loginForm.reset();
          this.router.navigateByUrl(this.returnUrl);
        }
        else{       
        // this.router.navigate(["shopping-cart"]);
         this.router.navigate([""]);
        }
       
        
      }
    },
    Error =>{
      console.log("Error", console.error);
      this.toastr.error(Error.error.title, "User login");
      this.errorString=Error.error.title;
    })
  }

  getShoppingCarts(){
    this.shoppingCartService.getShoppingCarts(this.securityObject.Email).subscribe({
      next: productsShoppingCart => {
        let shoppigCartTest =  productsShoppingCart
      },
      error: err => {      
        console.log(err)
      }
    })
  }

  getAddress(){
    //this.address = this.adressForm.value;
      
      this.userService.getAddress(this.securityObject.Email).subscribe({
      next: data =>{
        
        console.log(data)
      },
      error: err => console.log(err)
      })
    }

}
