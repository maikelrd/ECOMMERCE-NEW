import { Component, NgModule } from '@angular/core';


import { RouterModule } from '@angular/router';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ConvertToSpacesPipe } from '../shared/convert-to-space.pipe';
import { CategoryComponent } from '../category/category/category.component';
import { DepartmentComponent } from '../department/department/department.component';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart/shopping-cart.component';

import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductDetailsGuard } from './product-details/product-details.guard';
import { ProductEditGuard } from './product-edit/product-edit.guard';
import { AuthGuard } from '../guards/auth.guard';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { DragDirective } from './drag.directive';

import { NgxPaginationModule } from 'ngx-pagination';
import { CheckoutComponent } from '../shopping-cart/checkout/checkout.component';




@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailsComponent,
    ConvertToSpacesPipe,
    ProductEditComponent,
    CategoryComponent,
    DepartmentComponent,
    ShoppingCartComponent,
    DragDirective    
  ],
  imports: [ 
    RouterModule.forChild([
     {path: "",
    children: [
      {path: '', component:ProductListComponent},
      {path: 'product/:id', component:ProductDetailsComponent},  
      {path: 'product/:id/product/:id/edit', canDeactivate:[ProductEditGuard],component:ProductEditComponent},
      {path:"category/:id",component:CategoryComponent},
      {path: 'category/:id/product/:id', component:ProductDetailsComponent},
      {path: 'category/:id/product/:id/product/:id/edit', canDeactivate:[ProductEditGuard],component:ProductEditComponent},
      {path:"category/:id/category/:id",component:CategoryComponent},//this was added for the category in the offcanvas in category.component.html
      {path:"department", component:DepartmentComponent},
      {path:"product/:id/shopping-cart/:id", component: ShoppingCartComponent, canActivate: [AuthGuard]},
      {path:"category/:id/product/:id/shopping-cart/:id", component:ShoppingCartComponent, canActivate: [AuthGuard]},
      {path:"shopping-cart", component: ShoppingCartComponent, canActivate: [AuthGuard]},
      {path:"checkout", component: CheckoutComponent, canActivate:[AuthGuard]}
    ]}
  
    ]),
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: []
})
export class ProductModule { }
