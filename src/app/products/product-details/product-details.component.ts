import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';

import { IProduct } from '../products'; 
import { ProductService } from '../product.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  pageTitle='Product Detail';
  errorMessage='';
 // product:IProduct | undefined;
 product:IProduct =
  {
    ProductId:0,
    ProductName:'',
    ProductCode:'',
    ReleaseDate:'',
    CategoryId:0,
    UnitPrice:0,
    StockQty:0,
    Description: '',
    StarRating: 0,
    //Url:'',
    //Total:0
    Images:  []
    
    };

  constructor(private route: ActivatedRoute,
              private router:Router,
              private productService:ProductService) { }

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
     // this.product=this.createImages(product);  
     this.product = product;    
      console.log(this.product);
      
    },
    error:err=>this.errorMessage=err
   })
  }

  onBack():void{
    this.router.navigate(['']);
  }  

}
