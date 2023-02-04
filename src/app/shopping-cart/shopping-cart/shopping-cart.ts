import { IProduct } from "src/app/products/products";
import { IProductInShoppingCart } from "../productInShoppingCart";
//import {IProductInShoppingCart} from "src/app/shopping-cart"
//import { IProductShoppingCart } from "../productInShoppingCart";

export interface IShoppingCart{
    ShoppingCartId: number;    
    UserEmail: string;
    ProductsInShoppingCart: IProductInShoppingCart[];
    Total: number;
}
/* export interface IShoppingCart{
    ShoppingCartItemId: number;
    Product: IProduct;
    ProductId: number;
    Amount: number;
    UserEmail: string;
    Total: number;
} */