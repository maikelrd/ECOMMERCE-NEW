import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/category/category';
import { CategoryService } from 'src/app/category/category.service';
import { DepartmentService } from 'src/app/department/department.service';
import { Department } from 'src/app/department/department/department';
import { ProductService } from '../product.service';
import { IProduct } from '../products';


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

  countProducts: number = 0; // count of products in the BD
  countPages: number = 0; //count pages of products of 10 products each one
  arrayCountPages: number[]= []; //Array that store consecutive number until countPage.
  previousEnable: boolean = true;
  nextEnable: boolean = false;

  //public page!:number;
  page: number = 0; // actual page

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


  

  constructor(private productService:ProductService, private categoryService: CategoryService, private departmentService: DepartmentService ) { }
  //constructor() { }

  ngOnInit(): void {
    //this.getProducts();
    this.getCountProducts();
    this.page = 0; 
    if(this.page == 0){
      this.previousEnable = true;
      this.nextEnable = false ;
    }
   
    this.getProductsByPage(this.page)
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
        /* for(let i=0 ; i<products.length;i++){
          products[i]=this.createImages(products[i]);
          console.log(products[i])
         }  */
        this.products=products;
        console.log(this.products)
        this.filteredProducts=this.products;
      },
      error:err=>{this.errorMessage=err,
      console.log(err)}
    });
  } 

  getProductsByPage(page: number){
    this.productService.getProductsByPage(page).subscribe({
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

  getCountProducts(){
    this.productService.getCountProducts().subscribe({
      next: count=>{       
        this.countProducts=count;
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
    this.getProductsByPage(this.page);
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
}
