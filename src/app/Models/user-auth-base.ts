export class UserAuthBase{
    UserName:string="";
    Email: string = "";
    Token:string="";
    IsAuthenticated:boolean=false;
    CanAccessProducts:boolean=false;

    init():void{
        this.UserName="";
        this.Email = "";
        this.Token="";
        this.IsAuthenticated=false;
        this.CanAccessProducts=false;
    }
}