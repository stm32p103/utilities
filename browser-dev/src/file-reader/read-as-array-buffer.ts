import { throwError, merge, EMPTY, NEVER } from 'rxjs';
import { map, flatMap, takeUntil } from 'rxjs/operators';
import { ObservableFileReader } from './observable-file-reader';

/**
 * 指定したFileを読み込みArrayBufferに格納する。
 * @param file 読み出すファイル。
 * @param maxSize 1回の読出しあたりの最大バイト数。
 */
export function readAsArrayBuffer( file: File, maxSize: number ) {
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
      return EMPTY;
    } else {
      return NEVER;
    }
  } ) );
      
  return merge( data, abort ).pipe( takeUntil( finish ) );
}
