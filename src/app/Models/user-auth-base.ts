export class UserAuthBase{
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
}