import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../category.service';
import { Category } from '../category';
import { IProduct } from 'src/app/products/products';

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



  constructor(private categoryService: CategoryService, private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer) { 
    
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if(param){
      const id= +param;
      this.getCategory(id);
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
