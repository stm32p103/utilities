import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PasteService, ResizeService } from 'dom-event-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [PasteService, ResizeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
