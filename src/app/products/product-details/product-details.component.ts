import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';

import { IProduct } from '../products'; 
import { ProductService } from '../product.service';
import { FileHandle } from '../file-handle';
import { IImageModel } from '../images-model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  pageTitle='Product Detail';
  errorMessage='';
  product:IProduct | undefined;

  constructor(private route: ActivatedRoute,
              private router:Router,
              private productService:ProductService,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const param=this.route.snapshot.paramMap.get('id');
    if(param){
      const id= +param;
      this.getProducts(id);
    }
  }

  getProducts(id: number) {
   this.productService.getProduct(id).subscribe({
    next:product=>{
      this.product=this.createImages(product);      
      console.log(this.product);
      
    },
    error:err=>this.errorMessage=err
   })
  }

  onBack():void{
    this.router.navigate(['']);
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
