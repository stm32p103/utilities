import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Observable, Subject, from } from 'rxjs';
import { flatMap, map, filter } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasteService {
  private eventSubject = new Subject<ClipboardEvent>();

  constructor(private eventManager: EventManager) {
    // Windowに対するペーストイベントをSubjectにする
    this.eventManager.addGlobalEventListener('window', 'paste', async ( event: ClipboardEvent ) => this.eventSubject.next( event ) );
  }

  /**
   * @returns ClipboardEvent observable.
   */
  get paste(): Observable<ClipboardEvent> {
    return this.eventSubject;
  }

  /**
   * `window`にペーストされたテキストデータをMIMEタイプを指定して取得する。
   * 非テキストの場合は`file`で取得する。
   * 
   * MIME type: https://developer.mozilla.org/ja/docs/Web/HTTP/Basics_of_HTTP/MIME_types
   * @param mimeType 'text/html', 'text/plain', etc.
   * @returns `window`にペーストされたテキストデータ
   */
  getData( mimeType: string ): Observable<string> {
    return this.eventSubject.pipe( 
      map( e => e.clipboardData.getData( mimeType ) ),
      filter( data => data.length > 0 )
    );
  }

  /**
   * `window`にペーストされた`File`(画像など)を取得する。
   * 
   * @returns `window`にペーストされた非テキストデータ
   */
  get file() {
    // ブラウザ・バージョンによって変わるので、将来使えなくなるかもしれない
    // なぜか動作しなくなった。FileのLengthが1なのに、中身がundefinedになってしまう。
    return this.eventSubject.pipe( flatMap( e => {
      const files = e.clipboardData.files;
      const array: File[] = [];

      // 一旦配列にする
      for( let i = 0; i < files.length; i++ ) {
        const file = files.item[ i ];
        if( file ) {
          array.push( file );
        }
      }

      // Observableにする
      return from( array );
    } ) );
  }

  /**
   * `winddow`にペーストされた`ImageBitmap`を取得する。
   * 
   * @returns 'window'にペーストされた画像(ImageBitmap)のObservable
   */
  get image() {
    // MIME TypeがImageから始まっていたら画像として扱う
    // https://developer.mozilla.org/ja/docs/Web/HTTP/Basics_of_HTTP/MIME_types
    return this.file.pipe( 
      filter( file => file.type.match( '^image/' ).length > 0 ),
      flatMap( file => from( createImageBitmap( file ) ) )
    );
  }
}
