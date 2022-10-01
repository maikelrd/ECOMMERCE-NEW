import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/category/category';
import { CategoryService } from 'src/app/category/category.service';
import { DepartmentService } from 'src/app/department/department.service';
import { Department } from 'src/app/department/department/department';
import { ProductService } from '../product.service';
import { IProduct } from '../products';

import { IImageModel } from '../images-model';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from '../file-handle';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  pageTitle:string='Product List';
  imageWidth:number=150;
  imageHeigth:number=100;
  imageMargin:number=2;
  showImage:boolean=false;
  errorMessage:string='';
  sub!: Subscription;

  private _listFilter:string='';

  get listFilter():string{
    return this._listFilter;
  }
  set listFilter(value:string){
    this._listFilter=value;
    console.log('In setter: ',value);
    this.filteredProducts=this.performFilter(value);
  }
 
  filteredProducts:IProduct[]=[];
  products:IProduct[]=[]
  departments: Department[]= [];
  categories: Category[]= [];

  

  constructor(private productService:ProductService, private categoryService: CategoryService, private departmentService: DepartmentService,
                      private sanitizer: DomSanitizer) { }
  //constructor() { }

  ngOnInit(): void {
    this.getProducts();
    this.getDepartments();
    this.getCategories();
  }

  
  performFilter(filterBy:string):IProduct[]{
    filterBy=filterBy.toLocaleLowerCase();
    return this.products.filter((product:IProduct)=>
    product.ProductName.toLocaleLowerCase().includes(filterBy));
  }
  
  toggleImage():void{
     this.showImage=!this.showImage;
  }

  onRatingClicked(message:string):void{
    this.pageTitle='Product List'+message;
  }

  getProducts(){
    this.productService.getProducts().subscribe({
      next:products=>{
        for(let i=0 ; i<products.length;i++){
          products[i]=this.createImages(products[i]);
          console.log(products[i])
         }
        this.products=products;
        console.log(this.products)
        this.filteredProducts=this.products;
      },
      error:err=>{this.errorMessage=err,
      console.log(err)}
    });
  } 

  getDepartments(){
    this.departmentService.getDepartments().subscribe({
      next: departments => {
        this.departments = departments;
      },
      error : err => {
        this.errorMessage = err,
        console.log(err)
      }
    });
  }

  getCategories(){
    this.categoryService.getCategories().subscribe({
  next: categories =>{
        this.categories = categories;
      },
    error : err => {
      this.errorMessage = err,
      console.log(err) }    
    });
  }

  createImages(product: IProduct): IProduct{
    
    for(let i =0; i<product.Images.length; i++){
      const imageBlob= this.dataUrltoBlob(product.Images[i].PicByte, product.Images[i].Type);
 
     const imageFile= new File([imageBlob], product.Images[i].Name, {type: product.Images[i].Type});
 
     const finalFileHandle :FileHandle ={
       file: imageFile,
       url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
     };
     product.Images[i].fileHandle = finalFileHandle;
     
    }
     return product;
   }
 
   dataUrltoBlob(picBytes:string,imageType:string): Blob{
     const byteString= window.atob(picBytes);
     const arrayBuffer = new ArrayBuffer(byteString.length);
     const int8Array = new Uint8Array(arrayBuffer);
 
     for(let i=0; i<byteString.length; i++){
       int8Array[i]= byteString.charCodeAt(i);
     }
     const blob = new Blob([int8Array], {type: imageType});
     return blob;
   }


}
