import { IProduct } from "../products/products";

export class Category {
     public constructor(init?: Partial<Category>){
        Object.assign(this, init);
    } 
    CategoryId: number = 0;
    CategoryName: string ="";
    DepartmentId : number = 0;
    Products : IProduct[]= [];
  /*   constructor(
        public CategoryId =0,
        public CategoryName="",
        public DepartmentId = 0,
        Product =[]

    ){} */
}