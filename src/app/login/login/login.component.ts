import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { UserService } from 'src/app/services/user.service';
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

  constructor(private fb:FormBuilder, private userService:UserService, private router:Router, private route:ActivatedRoute) {
     this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['',Validators.required]
    })
   }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl')!;
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
        if(this.returnUrl){
          this.router.navigateByUrl(this.returnUrl);
        }
        this.loginForm.reset();
        
      }
    },
    Error =>{
      console.log("Error", console.error);
      this.errorString=Error.error;
    })
  }

}
