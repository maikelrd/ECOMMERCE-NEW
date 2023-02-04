import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css']
})
export class PaymentMethodsComponent implements OnInit {
  overview: boolean = false;
  wallet: boolean = false;
  transactions: boolean = false;
  settings: boolean = false;

  errorMessage: string = '';

  constructor() { }

  ngOnInit(): void {
    this.errorMessage='';

    this.overview = false;
    this.wallet = true;
    this. transactions = false;
    this.settings = false;
  }

  overviewMethod(){
    this.overview = true;
    this.wallet = false;
    this. transactions = false;
    this.settings = false;
  }

  walletMethod(){
    this.overview = false;
    this.wallet = true;
    this. transactions = false;
    this.settings = false;
  }

  transactionsMethod(){
    this.overview = false;
    this.wallet = false;
    this. transactions = true;
    this.settings = false;
  }

  settingsMethod(){
    this.overview = false;
    this.wallet = false;
    this. transactions = false;
    this.settings = true;
  }
}
