import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ResizeService, PasteService } from 'dom-event';
import { table2array } from 'browser-util';
import { readAsText, readAsDataURL } from 'browser-util';
import { map, flatMap } from "rxjs/operators";
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  width: number = window.innerWidth;
  height: number = window.innerHeight;
  table: string[][] = [];
  files: Subject<File> = new Subject();
  images: Subject<File> = new Subject();
  image: string = '';
  fileContent: string = '';

  @ViewChild('preview') preview: HTMLImageElement;

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

    this.files.pipe( flatMap( file => readAsText( file ) ) ).subscribe( txt => { 
      this.fileContent = txt;
      console.log(txt)
    } );

  }

  select(event: InputEvent) {
    const target = event.target as any;
    const files: FileList = target.files;

    for( let i = 0; i < files.length; i++ ) {
      this.files.next( files[i] );
    }
  }

  selectImage(event: InputEvent) {
    const target = event.target as any;
    const files: FileList = target.files;

    for( let i = 0; i < files.length; i++ ) {
      this.images.next( files[i] );
    }
  }

  ngAfterViewInit() {
    this.images.pipe( flatMap( file => readAsDataURL( file ) ),
    map( ( img ) => {
      this.image = img;
    } ) ).subscribe();
  }
}
