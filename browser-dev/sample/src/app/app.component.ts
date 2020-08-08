import { Component } from '@angular/core';
import { map, flatMap, tap } from "rxjs/operators";
import { Subject, Observable } from 'rxjs';
import { readAsText } from '../../../dist/file-reader'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  files: Subject<File> = new Subject();
  contents: string[] = [];
  constructor() {
    this.files.pipe( 
      flatMap( file => readAsText( file ) ), 
      tap( str => this.contents.push( str ) )
    ).subscribe();
  }

  select( event: InputEvent) {
    const target = event.target as any;
    const files: FileList = target.files;
    this.contents = [];

    for( let i = 0; i < files.length; i++ ) {
      this.files.next( files[i] );
    }
  }
}
