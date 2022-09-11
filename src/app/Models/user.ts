export class User{
    public constructor(init?: Partial<User>){
        Object.assign(this, init);
    }
   FirstName:string="";
     LastName:string="";   
     Email:string="";     
     IsAuthenticated:boolean=false;
}
/* export interface User{
    
   FirstName:string;
     LastName:string;   
     Email:string;     
     IsAuthenticated:boolean;
} */
/* export class User{
    public constructor(init?: Partial<User>){
        Object.assign(this, init);
    }
   FirstName:string="";
     LastName:string="";   
     Email:string="";     
     IsAuthenticated:boolean=false;
}

 */
   /*  init():void{

       this.FirstName="";
        this.LastName="";  
       this.Email="";     
        this.IsAuthenticated=false; 
       
    }
} */

   /*  export class UserAuthBase{
        UserName:string="";
        Token:string="";
        IsAuthenticated:boolean=false;
        CanAccessProducts:boolean=false;
    
        init():void{
            this.UserName="";
            this.Token="";
            this.IsAuthenticated=false;
            this.CanAccessProducts=false;
        }
    } */
   /*  export class Category {
        public constructor(init?: Partial<Category>){
           Object.assign(this, init);
       } 
       CategoryId: number = 0;
       CategoryName: string ="";
       DepartmentId : number = 0;
       Products : IProduct[]= []; */