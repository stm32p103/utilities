import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ResizeService, PasteService } from 'dom-event-service';

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
  files: Subject<File> = new Subject();
  images: Subject<File> = new Subject();
  fileContent: string = '';

  @ViewChild('tableContainer') tableContainer: ElementRef<HTMLDivElement>;
  @ViewChild('imageContainer') imageContainer: ElementRef<HTMLCanvasElement>;

  constructor( private resize: ResizeService, private paste: PasteService ) {
    // innerWidth, innerHeightを反映する。
    this.resize.inner.subscribe( size => {
      this.width = size.w;
      this.height = size.h;
    } );
  }

  select(event: InputEvent) {
    const target = event.target as any;
    const files: FileList = target.files;

    for( let i = 0; i < files.length; i++ ) {
      this.files.next( files[i] );
    }
  }

  ngAfterViewInit() {
    const context = this.imageContainer.nativeElement.getContext('2d');
    this.paste.image.pipe( map( image => {
      context.drawImage( image, 0, 0 );
      console.log( image );
    } ) ).subscribe();

    this.paste.getData( 'text/html' ).pipe( map( ( html ) => {
      const parser = new DOMParser();
      const doc: HTMLDocument = parser.parseFromString( html, 'text/html' );
      const table = doc.querySelector( 'table' );

      if( table != null ) {
        const oldTable = this.tableContainer.nativeElement.firstElementChild;
        if( oldTable ) {
          oldTable.remove();
        }
        this.tableContainer.nativeElement.appendChild( table );
      }
    } ) ).subscribe();
  }
}
