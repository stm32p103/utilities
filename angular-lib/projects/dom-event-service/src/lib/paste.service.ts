import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { getDataTransferItem, getFile, getImage, getString } from '@stm32p103/browser-utilities';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasteService {
  private readonly eventSubject = new Subject<ClipboardEvent>();
  private readonly itemObservable: Observable<DataTransferItem>;

  constructor( private eventManager: EventManager ) {
    // Windowに対するペーストイベントからDataTransferItemを取得する
    this.eventManager.addGlobalEventListener( 'window', 'paste', ( event: ClipboardEvent ) => {
      this.eventSubject.next( event );
    } );

    this.itemObservable = this.eventSubject.pipe( getDataTransferItem(), share() );
  }

  /**
   * `winddow`にペーストされたデータ(DataTransferItem)を取得する。
   * @returns 'window'にペーストされたデータ。
   */
  get item() {
    return this.itemObservable;
  }

  /**
   * `winddow`にペーストされたテキストを取得する。
   * @param mimeType MIME Type
   * @returns 'window'にペーストされたテキストの`Observable`
   */
  getString( mimeType: RegExp | string = /text/ ) {
    return this.itemObservable.pipe( getString( mimeType ) );
  }

  /**
   * `winddow`にペーストされたファイル(非テキスト)を取得する。
   * 
   * @param mimeType MIME Type
   * @returns 'window'にペーストされた`File`の`Observable`
   */
  getFile( mimeType: RegExp | string ) {
    return this.itemObservable.pipe( getFile( mimeType ) );
  }

  /**
   * `winddow`にペーストされた`ImageBitmap`を取得する。
   * 
   * @returns 'window'にペーストされた画像(ImageBitmap)のObservable
   */
  getImage() {
    return this.itemObservable.pipe( getImage() );
  }
}
