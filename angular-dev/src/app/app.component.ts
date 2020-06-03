import { Component } from '@angular/core';
import { ResizeService } from 'dom-event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  width: number = window.innerWidth;
  height: number = window.innerHeight;
  constructor( private resize: ResizeService ) {
    this.resize.inner.subscribe( size => {
      this.width = size.w;
      this.height = size.h;
    } );
  }
}
