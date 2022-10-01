import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildDecorator, ElementRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs';

import { IProduct } from '../products';
import { ProductService } from '../product.service';

import { NumberValidators } from 'src/app/shared/number.validator';
import { FileHandle } from '../file-handle';
import { DomSanitizer } from '@angular/platform-browser';
import { IImageModel } from '../images-model';



@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  //@ViewChildren(FormControlName, {read:ElementRef}) formInputElements:ElementRef[];

  pageTitle='Product Edit';
  errorMessage: string='';

  imageWidth:number=150;
    imageMargin:number=2;

  registerForm:FormGroup;

  arrayFile: FileHandle[]=[]

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
    //ImageUrl:'',
    Images: [] 
  
  };

  imageModel: IImageModel ={
    Id:0,
    Type: '',
   PicByte:'' ,
    Name: '',
   ProductId: 0,
  fileHandle: {file: {} as File, url:''}        
}
  //private sub:Subscription;

  constructor(private fb:FormBuilder,
              private route:ActivatedRoute,
              private router:Router,
              private productService:ProductService,
              private sanitizer: DomSanitizer)
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
      StarRating:['', NumberValidators.range(1,5)]
     // ImageUrl:''
     
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
      next:(product:IProduct)=>{
       // product = this.createImages(product);
        this.displayProduct(product)
      },
      error:err=>this.errorMessage=err
    });
  }

  displayProduct(product: IProduct): void {
    if(this.registerForm){
     // this.registerForm.reset();
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
      StarRating: this.product.StarRating
      //ImageUrl: this.product.ImageUrl      
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

        if(p.ProductId===0){
          const productFormData = this.prepareFormData(p);
          console.log(...productFormData)
          this.productService.createProduct(productFormData).subscribe({
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
   //1 this.registerForm.reset();
    this.router.navigate(['/products']);
  }

  onFileSelected(event: any){
    if(event.target.files){
      const file = event.target.files[0]; 
  
      const fileHandle: FileHandle ={
        file: file,
       // url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))
       url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))
      }
      
      this.arrayFile.push(fileHandle);
      /* this.arrayFiles.push(fileHandle);
      this.count=this.count +1; */
      console.log(this.arrayFile);
    
     
    }
    }

    deleteImage(id: number){     
      console.log(id);
      /* this.arrayFiles.forEach((element, index)=>{
        if(element == id) this.arrayFiles.splice(index,1);
      )}; */
   
          this.arrayFile.splice(id,1);

      console.log(this.arrayFile)
    }


    fileDropped(fileHandle: FileHandle){
      this.arrayFile.push(fileHandle);
      console.log(this.arrayFile)
    }
    prepareFormData(product: IProduct): FormData{
      const formData = new FormData();  
  
  // Display the key/value pairs
  
  
        formData.append(
        'Product', 
         //new Blob([JSON.stringify(this.product)], {type: 'application/json'})
         JSON.stringify(product)
         ) ; 
         
         for(var i = 0; i < this.arrayFile.length; i++){
          formData.append(
            'ImageFile',
            this.arrayFile[i].file,
           this.arrayFile[i].file.name   
         );         
        }  
      console.log(...formData) 
   

        return formData;
    }
    

}
