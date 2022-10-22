import { IProduct } from "../products/products";

export interface IProductShoppingCart{
    ProductShoppingCartId: number,
    ShoppingCartId: number,
    Product: IProduct,
    ProductId: number,
    Quantity: number,
    Total: number
}