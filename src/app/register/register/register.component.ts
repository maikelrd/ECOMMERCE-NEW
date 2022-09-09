import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,FormBuilder, Validators, AbstractControl,ValidatorFn,FormArray } from '@angular/forms';
import { debounce, debounceTime } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
  productForm:FormGroup;
  emailMessage:string='';

  get addresses():FormArray{
    return <FormArray>this.productForm.get('addresses');
  }

  private validationMessages={
    required:'Please enter your email address.',
    email:'Please enter a valid email address.'
  }



  constructor(private fb:FormBuilder) {  
    this.productForm=this.fb.group({
      productName:['',[Validators.required,Validators.minLength(3)]],
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
   const emailControl=this.productForm.get('email');
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
    console.log(this.productForm);
  }

  setMessage(c:AbstractControl):void{
    this.emailMessage='';
    if((c.touched || c.dirty) && c.errors){
      this.emailMessage=Object.keys(c.errors).map(
        key=>this.validationMessages[key as 'required']).join(' '); 
    }
  }

}
