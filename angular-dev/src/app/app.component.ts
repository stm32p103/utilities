import { Component } from '@angular/core';
import { ResizeService, PasteService } from 'dom-event';
import { table2array } from 'browser-util';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  width: number = window.innerWidth;
  height: number = window.innerHeight;
  table: string[][] = [];
  constructor( private resize: ResizeService, private paste: PasteService ) {
    this.resize.inner.subscribe( size => {
      this.width = size.w;
      this.height = size.h;
    } );

    this.paste.getData( 'text/html' ).pipe( map( ( html ) => {
      const parser = new DOMParser();
      const doc: HTMLDocument = parser.parseFromString( html, 'text/html' );
      const table = doc.querySelector( 'table' );
      if( table != null ) {
        this.table = table2array( table );
        console.log( this.table )  
      }
    } ) ).subscribe();
  }
}
