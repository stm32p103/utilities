import { Observable, fromEvent, throwError, merge, empty, never } from 'rxjs';
import { map, tap, take, flatMap, observeOn, takeUntil, share } from 'rxjs/operators';
import { ObservableFileReader } from './observable-file-reader';


export const readAsArrayBuffer = ( file: File, maxSize: number ) => {
  let loaded = 0;
  const reader = new ObservableFileReader();

  const read = ( start: number ) => {
    reader.readAsArrayBuffer( file.slice( start, Math.min( file.size, maxSize + start ) ) );
  };
      
  const abort = merge( reader.onAbort, reader.onError ).pipe( flatMap( evt => throwError( `Cannot read file. ${file.name}.` ) ) );

  const data = reader.onLoad.pipe(
    map( evt => {
      const res = ( evt as any ).target.result as ArrayBuffer;
      loaded += evt.loaded;
      if( loaded < file.size ) {  
        read( loaded );
      }
      return res;
    } )
  );
      
  const finish = data.pipe( flatMap( () => {
    if( loaded >= file.size ) {
      return empty();
    } else {
      return never();
    }
  } ) );
      
  return merge( data, abort ).pipe( takeUntil( finish ) );
}
