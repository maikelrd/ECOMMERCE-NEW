import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../category.service';
import { Category } from '../category';
import { IProduct } from 'src/app/products/products';

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



  constructor(private categoryService: CategoryService, private route: ActivatedRoute, private router: Router) { 
    
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
    product.firstName.toLocaleLowerCase().includes(filterBy)); */
    return this.products.filter((product:IProduct)=>
    product.firstName.toLocaleLowerCase().includes(filterBy)); 
   
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
        this.filteredProducts = category.Products;
      },
    error : err => {
      this.errorMessage = err,
      console.log(err) }    
    });
  }


}
