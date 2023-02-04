import { Component, createPlatform, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {   ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { CheckoutComponent } from './shopping-cart/checkout/checkout.component';
import { AccountComponent } from './account/account/account.component';
import { PaymentMethodsComponent } from './account/payment-methods/payment-methods.component';
import { WalletComponent } from './account/payment-methods/wallet/wallet.component';
import { OverviewComponent } from './account/payment-methods/overview/overview.component';
import { TransactionsComponent } from './account/payment-methods/transactions/transactions.component';
import { SettingsComponent } from './account/payment-methods/settings/settings.component';


//import { ProductService } from './products/product.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, 
        RegisterComponent, LoginComponent, ContactComponent, CheckoutComponent, AccountComponent, PaymentMethodsComponent, WalletComponent, OverviewComponent, TransactionsComponent, SettingsComponent
  ],
  imports: [
    BrowserModule,   
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
    HttpClientModule,RouterModule.forRoot([
      
      {path:"home",component:HomeComponent}, 
      {path:"register",component:RegisterComponent},  
      {path:"login", component:LoginComponent},   
      {path:"contact", component:ContactComponent},   
      {path:"account", component:AccountComponent},  
      {path:"paymentMethod", component:PaymentMethodsComponent},  
      {path:'', loadChildren: ()=> import('./products/product.module').then(m=> m.ProductModule)} ,  
      //{path:"category/:id", loadChildren: ()=> import('./products/product.module').then(m=> m.ProductModule)} , 
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
