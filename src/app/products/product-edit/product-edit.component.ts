import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildDecorator, ElementRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs';

import { IProduct } from '../products';
import { ProductService } from '../product.service';

import { NumberValidators } from 'src/app/shared/number.validator';



@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  //@ViewChildren(FormControlName, {read:ElementRef}) formInputElements:ElementRef[];

  pageTitle='Product Edit';
  errorMessage: string='';

  registerForm:FormGroup;

  product:IProduct={
    ProductId:0,
    ProductName:'',
    ProductCode:'',
    ReleaseDate:'',
    CategoryId:0,
    UnitPrice:0,
    StockQty:0,
    Description: '',
    StarRating: 0,
    ImageUrl:'',
    Total:0
  };
  //private sub:Subscription;

  constructor(private fb:FormBuilder,
              private route:ActivatedRoute,
              private router:Router,
              private productService:ProductService)
  { 
    this.registerForm=this.fb.group({
      ProductName:['',[Validators.required,
                    Validators.minLength(3)]],
      ProductCode:['',Validators.required],
      ReleaseDate:['',Validators.required],
      CategoryId:['',Number],
      UnitPrice:['', Number],
      StockQty:['', Number],
      Description:'',
      StarRating:['', NumberValidators.range(1,5)],
      ImageUrl:''
     
    });
  
  
  }

  ngOnInit(): void {
   /*  this.sub = this.route.paramMap.subscribe(
      params => {
        const id =+params.get('id');
        this.getProduct(id );
      }
    ); */
    const param=this.route.snapshot.paramMap.get('id');
    if(param){
      const id= +param
      this.getProduct(id);
    }
  }

  getProduct(id: number):void {
    this.productService.getProduct(id).subscribe({
      next:(product:IProduct)=>this.displayProduct(product),
      error:err=>this.errorMessage=err
    });
  }

  displayProduct(product: IProduct): void {
    if(this.registerForm){
      this.registerForm.reset();
    }
    this.product=product;

    if(this.product.ProductId===0){
      this.pageTitle='Add Product';
    } else {
      this.pageTitle = `Edit Product: ${this.product.ProductName}`;
    }

    // Update the data on the form
    this.registerForm.patchValue({
      ProductName: this.product.ProductName,
      ProductCode: this.product.ProductCode,
      ReleaseDate: this.product.ReleaseDate,
      CategoryId: this.product.CategoryId,
      UnitPrice: this.product.UnitPrice,
      StockQty: this.product.StockQty,
      Description: this.product.Description,
      StarRating: this.product.StarRating,
      ImageUrl: this.product.ImageUrl
      
    })
  }

  deleteProduct():void{
    if(this.product.ProductId===0){
      // Don't need delete, it was never.
      this.onSaveCompleted();
    } else {
      if (confirm(`Really delete the product: ${this.product.ProductName}`)){
        this.productService.deleteProduct(this.product.ProductId).subscribe({
          next:()=>this.onSaveCompleted(),
          error: err=>this.errorMessage= err
        });
      }
    }
  }

  saveProduct():void {
    if (this.registerForm.valid){
      if (this.registerForm.dirty){
        const p= {...this.product, ...this.registerForm.value};

        if(p.ProdId===0){
          this.productService.createProduct(p).subscribe({
            next: () => this.onSaveCompleted(),
            error: err => this.errorMessage = err
          });
        } else {
          this.productService.updateProduct(p).subscribe({
            next: () => this.onSaveCompleted(),
            error: err => this.errorMessage = err
          });
        }
      } else {
        this.onSaveCompleted();
      }
    } else {
      this.errorMessage= 'Please correct the validation errors.';
    }
  }


  onSaveCompleted(): void {
    // Reset the form to clear the flags
    this.registerForm.reset();
    this.router.navigate(['/products']);
  }



}
