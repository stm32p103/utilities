import { Observable, fromEvent } from 'rxjs';

export class FileReaderObservable {
  public readonly reader = new FileReader();
  private getEvent<T>( name: string ): Observable<T> {
    return fromEvent<T>( this.reader, name );
  }

  get onAbort() { return this.getEvent<ProgressEvent>( 'abort' ) }
  get onError() { return this.getEvent<ProgressEvent>( 'error' ) }
  get onLoad() { return this.getEvent<ProgressEvent>( 'load' ) }
  get onLoadEnd() { return this.getEvent<ProgressEvent>( 'loadend' ) }
  get onLoadStart() { return this.getEvent<ProgressEvent>( 'loadstart' ) }
  get onProgress() { return this.getEvent<ProgressEvent>( 'progress' ) }
}
