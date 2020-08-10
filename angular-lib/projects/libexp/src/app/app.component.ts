import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subject, from } from 'rxjs';
import { EventManager } from '@angular/platform-browser';
import { flatMap, map, filter } from 'rxjs/operators';

function toGetAsStringSubject( item: DataTransferItem ) {
  const subject = new Subject<string>();
  item.getAsString( result => subject.next( result ) );
  return subject;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  private itemSubject = new Subject<DataTransferItem>();

  @ViewChild( 'target' ) target: ElementRef<HTMLCanvasElement>;
  constructor( private eventManager: EventManager ) {
    // Windowに対するペーストイベントからDataTransferItemを取得する
    this.eventManager.addGlobalEventListener('window', 'paste', ( event: ClipboardEvent ) => {
      const items = event.clipboardData.items;
      for( let i = 0; i < items.length; i++ ) {
        this.itemSubject.next( items[i] );
      }
     } );

    this.itemSubject.pipe( map( item => {
      console.log( `${item.kind}, ${item.type}` );
    } ) ).subscribe();

    this.getString( /text\/plain/ ).subscribe( html => console.log( html ) ); 

  }

  ngAfterViewInit() {
    const context = this.target.nativeElement.getContext('2d');
    this.getImage().subscribe( image => context.drawImage( image, 0, 0 ) );
  }

  get item() {
    return this.itemSubject.asObservable();
  }

  getString( mimeType: RegExp | string ) {
    let tester: RegExp;
    if( typeof mimeType == 'string' ) {
      tester = /${mimeType}/;
    } else {
      tester = mimeType;
    }
    return this.itemSubject.pipe( 
      filter( item => ( item.kind == 'string' ) && ( tester.test( item.type ) ) ),
      flatMap( item => toGetAsStringSubject( item ) )
    );
  }

  getFile( mimeType: RegExp | string ) {
    let tester: RegExp;
    if( typeof mimeType == 'string' ) {
      tester = /${mimeType}/;
    } else {
      tester = mimeType;
    }
    return this.itemSubject.pipe( 
      filter( item => ( item.kind == 'file' ) && ( tester.test( item.type ) ) ),
      map( item => item.getAsFile() )
    );
  }

  getImage() {
    return this.getFile( /^image/ ).pipe( flatMap( file => from( createImageBitmap( file ) ) ) );
  }
}
