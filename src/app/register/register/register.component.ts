import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl,FormBuilder, Validators, AbstractControl,ValidatorFn,FormArray } from '@angular/forms';
import { debounce, debounceTime } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
//import { UserService } from 'src/app/services/user.service';
//import  { UserService } from 'src/app/services/user.service';





 function passwordMatcher(c:AbstractControl):{[key:string]:boolean}|null{
  const passwordControl=c.get('password');
  const confirmPassword=c.get('confirmPassword');

  if(passwordControl?.pristine || confirmPassword?.pristine){
    return null;
  }

  if(passwordControl?.value===confirmPassword?.value){
    return null
  }
  return {'match':true};
} 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm:FormGroup;
  emailMessage:string='';
  errorMessage:string='';

  get addresses():FormArray{
    return <FormArray>this.registerForm.get('addresses');
  }

  private validationMessages={
    required:'Please enter your email address.',
    email:'Please enter a valid email address.'
  }



  constructor(private fb:FormBuilder, private userService:UserService) {  
    this.registerForm=this.fb.group({
      firstName:['',[Validators.required,Validators.minLength(3)]],
      lastName:['',[Validators.required,Validators.maxLength(20)]],    
      email:['',[Validators.required, Validators.email]],    
      passwords:this.fb.group({
        password:['',[Validators.required,Validators.minLength(4)]],
        confirmPassword:['',Validators.required]
      },{validators:passwordMatcher}),
      includeAddress:false,
      addresses:this.fb.array([this.buildAddress()])

      });     
   }
  



  ngOnInit(): void {
   const emailControl=this.registerForm.get('email');
   emailControl?.valueChanges.pipe(
    debounceTime(1000)
   ).subscribe(
    value=>this.setMessage(emailControl));  

  }

  addAddress():void{
    this.addresses.push(this.buildAddress());
  }

  buildAddress(){
    return this.fb.group({
      addressType:'home',
      street1:'',
      street2:'',
      city:'',
      state:'',
      zip:''
    })
  }

  register(){
   // console.log(this.registerForm);
    let firstName = this.registerForm.controls['firstName'].value;
    let lastName = this.registerForm.controls['lastName'].value;  
    let password = this.registerForm.controls['passwords'].value.password;  
    let email = this.registerForm.controls['email'].value;  
    this.userService.register(firstName, lastName,email, password).subscribe((data)=>
    {
      console.log("response", data);
    },
    error =>{
      console.log("error", error.error);

    });


  }

  setMessage(c:AbstractControl):void{
    this.emailMessage='';
    if((c.touched || c.dirty) && c.errors){
      this.emailMessage=Object.keys(c.errors).map(
        key=>this.validationMessages[key as 'required']).join(' '); 
    }
  }

}
