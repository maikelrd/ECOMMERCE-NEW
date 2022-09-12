import { Component, OnInit } from '@angular/core';
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
  imageWidth:number=200;
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

  

  constructor(private productService:ProductService, private categoryService: CategoryService, private departmentService: DepartmentService) { }
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
        this.products=products;
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




}
