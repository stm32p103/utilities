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

@Injectable()
export class ResizeService {
  private eventSubject = new Subject<UIEvent>();

  constructor(private eventManager: EventManager) {
    // Windowに対するペーストイベントをSubjectにする
    this.eventManager.addGlobalEventListener('window', 'resize', async (event:UIEvent) => this.eventSubject.next(event) );
  }

  get event(): Observable<UIEvent> {
    return this.eventSubject;
  }

  get inner(): Observable<Size> {
    return this.eventSubject.pipe( map( () => {
      return { 'w': window.innerWidth, 'h': window.innerHeight };
    } ) )
  }

  get outer(): Observable<Size> {
    return this.eventSubject.pipe( map( () => {
      return { 'w': window.outerWidth, 'h': window.outerHeight };
    } ) )
  }
}
