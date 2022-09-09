import { Component, OnChanges, EventEmitter,Input,Output,SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.css']
})

export class StarComponent implements OnChanges {
  @Input() rating:number=0;
  cropWidth:number=75;
  
  @Output() ratingClicked:EventEmitter<string>=
  new EventEmitter<string>();

 
  ngOnChanges(): void {
  
  let temp=Math.trunc(this.rating);
  this.cropWidth=temp* 75/5;
  }
  onClick(){
    this.ratingClicked.emit(`The rating ${this.rating} was clicked`);
  }

}
