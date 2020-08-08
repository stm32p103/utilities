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

```ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  constructor( private paste: PasteService ) {
    const parser = new DOMParser();

    // Excel等から表を張り付けた場合に、表をHTMLTableElementとして取得する
    this.paste.getData('text/html').subscribe( data =>{
      const dom = parser.parseFromString( data, 'text/html' );
      const table = dom.getElementsByTagName( 'table' )[0];
      console.log( table );
    } );

    // ペーストした画像を取得する
  }
}
```