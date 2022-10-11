import { IProduct } from "../products/products";

export interface IFilterModel{
  Products: IProduct[];
  count: number;
}