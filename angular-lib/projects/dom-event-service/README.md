# DomEventService
DOMイベントをAngularのサービスとして公開したもの。

# 使い方

## サービスの登録
`*.module.ts`の`providers`に追加する。

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PasteService, ResizeService } from 'dom-event-service'

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
```

## ResizeService
リサイズイベントをサービス化する。`inner`と`outer`がそれぞれ`innerWidth/Height`と`outerWidth/Height`を公開する。

```ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  constructor( private resize: ResizeService ) {
    this.resize.inner.subscribe( size => {
      // innerwidth, innerHeight
      console.log( `Inner: ${size.w}, ${size.h}` );
    } );
    
    this.resize.outer.subscribe( size => {
      // outerWidth, outerHeight
      console.log( `Outer: ${size.w}, ${size.h}` );
    } );
  }
}
```

## PasteService
ペーストしたテキスト・画像を`Observable`として公開するサービス。
```ts
import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { PasteService } from 'dom-event-service';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('imageContainer') imageContainer: ElementRef<HTMLCanvasElement>;

  constructor( private paste: PasteService ) {}

  ngAfterViewInit() {
    const context = this.imageContainer.nativeElement.getContext( '2d' );
    this.paste.getImage().pipe( map( image => {
      context.drawImage( image, 0, 0 );
      console.log( image );
    } ) ).subscribe();

    this.paste.getString().subscribe( str => this.pastedString = str );
  }
}
```