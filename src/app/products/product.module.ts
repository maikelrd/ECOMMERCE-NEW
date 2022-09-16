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



@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailsComponent,
    ConvertToSpacesPipe,
    ProductEditComponent,
    CategoryComponent,
    DepartmentComponent,
    ShoppingCartComponent
    
 
   
  ],
  imports: [ 
    RouterModule.forChild([
      {path: 'products', component:ProductListComponent},
      {path: 'products/:id', canActivate:[ProductDetailsGuard],component:ProductDetailsComponent},
      {path: 'products/:id/edit', canDeactivate:[ProductEditGuard],component:ProductEditComponent,canActivate:[AuthGuard]},
      {path:"category/:id",component:CategoryComponent},
      {path:"department", component:DepartmentComponent},
      {path:"shopping-cart/:id", component: ShoppingCartComponent, canActivate: [AuthGuard]},
     // {path:"shopping-cart", component: ShoppingCartComponent, canActivate: [AuthGuard]}
  
    ]),
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ProductModule { }
