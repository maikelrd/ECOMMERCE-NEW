import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuthBase } from './Models/user-auth-base';
import { UserService } from './services/user.service';
//import { ProductListComponent } from './products/product-list/product-list.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pageTitle = 'ECOMMERCE';
  securityObject: UserAuthBase | undefined;
  subscription :Subscription | undefined;
  constructor(private securityService: UserService, private router: Router){
    this.securityObject=securityService.securityObject;
  }


  logOut(){
    this.securityService.logOut();
    this.securityObject=this.securityService.securityObject;
    localStorage.removeItem("AuthObject");
  }
}
