import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { map, flatMap, tap } from "rxjs/operators";
import { Subject, Observable } from 'rxjs';

import { readAsText } from '../../../dist/file-reader';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  files: Subject<File> = new Subject();
  fileContent: string = '';
  
  constructor() {
    this.files.pipe( flatMap( file => readAsText( file ) ) ).subscribe( txt => { 
      this.fileContent = txt;
    } );
  }

  select(event: InputEvent) {
    const target = event.target as any;
    const files: FileList = target.files;

    for( let i = 0; i < files.length; i++ ) {
      this.files.next( files[i] );
    }
  }

}
