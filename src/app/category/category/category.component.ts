import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../category.service';
import { Category } from '../category';
import { IProduct } from 'src/app/products/products';

import { ProductService } from 'src/app/products/product.service';

import { FileHandle } from 'src/app/products/file-handle';
import { IImageModel } from 'src/app/products/images-model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  pageTitle: string = 'Category List';
  categories: Category[] = [];
  //category: Category | undefined;
  category = new Category;
  products: IProduct[] = []
  errorMessage:string='';

  categoryId: number = 0;
  
 
 
  imageWidth:number=200;
  imageMargin:number=2;
  showImage:boolean=false;

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
  
 
  //pagination
  categoryPageUrl: string = "https://localhost:44386/api/PaginationCategory";
  countProducts: number = 0; // count of products by category in the BD
  countPages: number = 0; //count pages of products of 10 products each one
  arrayCountPages: number[]= []; //Array that store consecutive number until countPage.
  previousEnable: boolean = false;
  nextEnable: boolean = false;
  page: number = 0; // actual page

  constructor(private categoryService: CategoryService, private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer,
                     private productService: ProductService) { 
    
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if(param){
      const id= +param;
      this.categoryId = id;
      //this.getCategory(id);
      
      this.page = 0; 
      if(this.page == 0){
        this.previousEnable = true;
        this.nextEnable = false ;
      }
      this.getCountProducts(id);
      if(this.countPages<=1){
         this.previousEnable =true;
         this.nextEnable = true;
      }
      this.getProductsByPage(id, this.page);
    }
  }

  performFilter(filterBy:string):IProduct[]{
    filterBy=filterBy.toLocaleLowerCase();
   /*  return this.products.filter((product:IProduct)=>
    product.ProductName.toLocaleLowerCase().includes(filterBy)); */
    return this.products.filter((product:IProduct)=>
    product.ProductName.toLocaleLowerCase().includes(filterBy)); 
   
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

  getCategory(id: number){
    this.categoryService.getCategory(id).subscribe({
  next: category =>{
        this.category = category;
        this.products=category.Products;
        for(let i=0; i< this.products.length; i++){
          this.products[i]=this.createImages(this.products[i])
        }
        this.filteredProducts = this.products;
      },
    error : err => {
      this.errorMessage = err,
      console.log(err) }    
    });
  }

  getProductsByPage(categoryId: number, page: number){
    this.productService.getProductsByCategoryPage(categoryId, page).subscribe({
      next:products=>{
        
        this.products=products;
        console.log(this.products)
        if(page == 0){
          this.previousEnable = true;
          this.nextEnable = false;
        }
        
        if(page == this.countPages -1){
          this.nextEnable = true;
          this.previousEnable =false;
        }

        if (this.page > 0 && this.page < this.countPages-1){
          this.nextEnable = false;
          this.previousEnable = false;
        }

        if(this.countPages <= 1){
          this.nextEnable = true ;
          this.previousEnable = true;
        }
        this.filteredProducts=this.products;
      },
      error:err=>{this.errorMessage=err,
      console.log(err)}
    });
  } 

  getCountProducts(categoryId: number){
    this.productService.getCountProductsByCategory(categoryId).subscribe({
      next: count=>{       
        this.countProducts=count;
        //this.countPages = Math.ceil(this.countProducts/10);
        this.countPages = Math.ceil(this.countProducts/10);
        for(let i=0 ; i< this.countPages; i++){
          this.arrayCountPages[i]= i+1;
        }        

        console.log(this.countProducts);    
        console.log(this.countPages);       
      },
      error:err=>{this.errorMessage=err,
      console.log(err)}
    });
  } 

  productsPage(page: number){
    this.page = page
    this.getProductsByPage(this.categoryId,this.page);
  }

  nextPageProducts(){
    if(this.page < this.countPages -1){
      this.page= this.page + 1;
      this.previousEnable = false;
      this.productsPage(this.page);      
    }
    if(this.page ==  this.countPages -1){
      this.nextEnable = true;
    }
    
  }

  previousPageProducts(){
    if(this.page > 0){
      this.page = this.page - 1;
      this.nextEnable = false;
      this.productsPage(this.page);      
    }
    if(this.page == 0){
      this.previousEnable = true;
    }

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
