export class Address{
    public constructor(init?: Partial<Address>){
       Object.assign(this, init); 
    
   }
   
    Email:string="";
    Street:string="";  
    City:string="";
    State:string="";    
    ZipCode:number=0;    
    
}