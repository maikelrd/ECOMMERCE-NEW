import { IProduct } from "../products/products";

export interface IProductInShoppingCart{
    ProductShoppingCart: IProduct;
    Quantity: number
}