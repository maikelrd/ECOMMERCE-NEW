export class Card{
    public constructor(init?: Partial<Card>){
       Object.assign(this, init); 
    
   }
    Email:string="";
    CardId: number = 0;
    CardNumber:string=""
    NameOnCard:string="";        
    ExpMonth:number=0;  
    ExpYear:number=0;   
    lastDigits: string = ""  ;
    DefaultPMethod: boolean = false; 
    Type: string = '';
    ShowDefaultP: boolean = false;
    
}