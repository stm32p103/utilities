import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Observable, Subject, from } from 'rxjs';
import { flatMap, map, filter } from 'rxjs/operators';

@Injectable()
export class PasteService {
  private eventSubject = new Subject<ClipboardEvent>();

  constructor(private eventManager: EventManager) {
    // Windowに対するペーストイベントをSubjectにする
    this.eventManager.addGlobalEventListener('window', 'paste', async ( event: ClipboardEvent ) => this.eventSubject.next( event ) );
  }

  get event(): Observable<ClipboardEvent> {
    return this.eventSubject;
  }

  // MIMEタイプを指定してデータを取得する
  getData( mimeType: string ): Observable<string> {
    return this.eventSubject.pipe( 
      map( e => e.clipboardData.getData( mimeType ) ),
      filter( data => data.length > 0 )
    );
  }

  private getFile() {
    // この辺の仕様はブラウザ・バージョンによって変わるので、将来使えなくなるかもしれない
    return this.eventSubject.pipe( flatMap( e => {
      const files = e.clipboardData.files;
      const array: File[] = new Array<File>( files.length );

      // 一旦配列にする
      for( let i = 0; i < files.length; i++ ) {
        array[ i ] = files.item[ i ];
      }

      // Observableにする
      return from( array );
    } ) );
  }

  getImage() {
    // MIME TypeがImageから始まっていたら画像として扱う
    // https://developer.mozilla.org/ja/docs/Web/HTTP/Basics_of_HTTP/MIME_types
    return this.getFile().pipe( 
      filter( file => file.type.match( '^image/' ).length > 0 ),
      flatMap( file => from( createImageBitmap( file ) ) )
    );
  }
}
