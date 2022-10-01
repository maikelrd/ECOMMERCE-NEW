import { IImageModel } from "./images-model";

export interface IProduct{
/*     prodId:number;
    prodName:string;
    prodCode:string;
    releaseDate:string;
    category:string;
    unitPrice:number;
    stockQty:number;
    description: string;
    StarRating: number;
    imageUrl:string; */
    ProductId:number;
    ProductName:string;
    ProductCode:string;
    ReleaseDate:string;
    CategoryId:number;
    UnitPrice:number;
    StockQty:number;
    Description: string;
    StarRating: number;
    //ImageUrl:string;
    
    Images: IImageModel[];
    //Total:Number;
}