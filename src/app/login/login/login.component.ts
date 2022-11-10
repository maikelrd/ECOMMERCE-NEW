import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { UserService } from 'src/app/services/user.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';   
import { UserService } from 'src/app/services/user.service';
import { UserAuthBase } from 'src/app/Models/user-auth-base';

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
                                     private toastr: ToastrService) {
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
        localStorage.setItem("AuthObject",JSON.stringify(resp));
        this.securityObject = resp;
        this.errorString = "";
        this.loginForm.reset();
        if(this.returnUrl){
          this.loginForm.reset();
          this.router.navigateByUrl(this.returnUrl);
        }
        else{       
          this.router.navigate(["shopping-cart"]);
         //this.router.navigate([""]);
        }
       
        
      }
    },
    Error =>{
      console.log("Error", console.error);
      this.toastr.error(Error.error.title, "User login");
      this.errorString=Error.error.title;
    })
  }

}
