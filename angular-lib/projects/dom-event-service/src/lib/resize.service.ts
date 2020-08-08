import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

// Resize Observer がドラフトのため自作
// https://stackoverflow.com/questions/1664785/resize-html5-canvas-to-fit-window

export interface Size {
  w: number;
  h: number;
};

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class ResizeService {
  private eventSubject = new Subject<UIEvent>();

  constructor(private eventManager: EventManager) {
    this.eventManager.addGlobalEventListener('window', 'resize', async (event:UIEvent) => this.eventSubject.next(event) );
  }

  /**
   * @returns resizeイベントのObservable
   */
  get event(): Observable<UIEvent> {
    return this.eventSubject;
  }

  /**
   * @returns ウィンドウサイズ(innerWidth, innerHeight)
   */
  get inner(): Observable<Size> {
    return this.eventSubject.pipe( map( () => {
      return { 'w': window.innerWidth, 'h': window.innerHeight };
    } ) )
  }

  /**
   * @returns ウィンドウサイズ(outerWidth, outerHeight)
   */
  get outer(): Observable<Size> {
    return this.eventSubject.pipe( map( () => {
      return { 'w': window.outerWidth, 'h': window.outerHeight };
    } ) )
  }
}
