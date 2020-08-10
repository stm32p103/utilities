import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { PasteService, ResizeService } from 'dom-event-service';

import { map, flatMap, tap } from "rxjs/operators";
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  width: number = window.innerWidth;
  height: number = window.innerHeight;
  pastedString: string = '';

  @ViewChild('imageContainer') imageContainer: ElementRef<HTMLCanvasElement>;

  constructor( private resize: ResizeService, private paste: PasteService ) {
    // innerWidth, innerHeightを反映する。
    this.resize.inner.subscribe( size => {
      this.width = size.w;
      this.height = size.h;
    } );
  }

  ngAfterViewInit() {
    const context = this.imageContainer.nativeElement.getContext( '2d' );
    this.paste.getImage().pipe( map( image => {
      context.drawImage( image, 0, 0 );
      console.log( image );
    } ) ).subscribe();

    this.paste.getString().pipe( tap( str => this.pastedString = str ) ).subscribe();
  }
}
