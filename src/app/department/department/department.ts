import { Category } from "src/app/category/category";

export interface Department{
    DepartmentId: number ;
    DepartmentName: string;
    Categories: Category[];
}