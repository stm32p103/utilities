import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { map, flatMap, tap } from "rxjs/operators";
import { Subject, Observable } from 'rxjs';
import { readAsText } from '../../../dist/file-reader'

import { table2array } from '../../../dist/dom'
import { getDataTransferItem, getString, getImage } from '../../../dist/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  files: Subject<File> = new Subject();
  clipboardEvent: Subject<ClipboardEvent> = new Subject();

  pastedString: string = '';
  contents: string[] = [];

  @ViewChild('imageContainer') imageContainer: ElementRef<HTMLCanvasElement>;
  constructor( private eventManager: EventManager ) {
    this.files.pipe( 
      flatMap( file => readAsText( file ) ), 
      tap( str => this.contents.push( str ) )
    ).subscribe();

    // Windowに対するペーストイベントからDataTransferItemを取得する
    this.eventManager.addGlobalEventListener('window', 'paste', ( event: ClipboardEvent ) => {
      this.clipboardEvent.next( event );
    } );
  }

  select( event: InputEvent ) {
    const target = event.target as any;
    const files: FileList = target.files;
    this.contents = [];

    for( let i = 0; i < files.length; i++ ) {
      this.files.next( files[i] );
    }
  }

  ngAfterViewInit() {
    const item = this.clipboardEvent.pipe( getDataTransferItem() )
    item.pipe( getString( /plain/ ) ).subscribe( str => this.pastedString = str );

    const context = this.imageContainer.nativeElement.getContext('2d');
    item.pipe( getImage() ).subscribe( image => context.drawImage( image, 0, 0 ) );  
  }
}
