import { Component, createPlatform, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {   ReactiveFormsModule } from '@angular/forms';
import { HttpClient,HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppComponent } from './app.component';
import { HomeComponent } from './Home/home/home.component';
import { RegisterComponent } from './register/register/register.component';
//import { ProductModule } from './products/product.module';
import { LoginComponent } from './login/login/login.component';
import { AuthInterceptor } from './http-interceptor/auth.interceptor';;
import { ToastrModule } from 'ngx-toastr';
import { ShoppingCartService } from './shopping-cart/shopping-cart.service';
import { ContactComponent } from './contact/contact/contact.component';

//import { ProductService } from './products/product.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, 
        RegisterComponent, LoginComponent, ContactComponent
  ],
  imports: [
    BrowserModule,   
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
    HttpClientModule,RouterModule.forRoot([
      
      {path:"home",component:HomeComponent}, 
      {path:"register",component:RegisterComponent},  
      {path:"login", component:LoginComponent},   
      {path:"contact", component:ContactComponent},   
      {path:'', loadChildren: ()=> import('./products/product.module').then(m=> m.ProductModule)} ,  
      {path:'',redirectTo:'HomeComponent',pathMatch:'full'},
      {path:'**',redirectTo:'HomeComponent',pathMatch:'full'}
    ]),  
   // ProductModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
