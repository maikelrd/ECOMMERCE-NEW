export class RegisterResponse{
    public constructor(init?: Partial<RegisterResponse>){
       Object.assign(this, init); 
    
   }
   
    Status:string="";
    Message:string="";    
    
}