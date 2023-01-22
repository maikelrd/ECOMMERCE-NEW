import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarComponent } from './star.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigurationComponent } from './configuration/configuration.component';




@NgModule({
  declarations: [
    StarComponent,
    ConfigurationComponent,   
  ],
  imports: [
    CommonModule
  ],
  exports:[
    CommonModule,
    FormsModule,
    StarComponent
  ]
})
export class SharedModule { }
