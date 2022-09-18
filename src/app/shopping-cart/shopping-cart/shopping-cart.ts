import { IProduct } from "src/app/products/products";

export interface IShoppingCart{
    ShoppingCartItemId: number;
    Product: IProduct;
    ProductId: number;
    Amount: number;
    UserEmail: string;
    Total: number;
}