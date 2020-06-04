import { Observable, throwError, merge } from 'rxjs';
import { map, flatMap, takeUntil } from 'rxjs/operators';
import { FileReaderObservable } from './file-reader-observable';

// ファイルの読み込みをするだけのOperator
// 何らかの理由で中断したら例外を投げる
export const readAsText = () => ( src: Observable<File> ) => {
  return src.pipe(
    flatMap( file => {
      const obs = new FileReaderObservable();
      const failed = merge( obs.onAbort, obs.onError ).pipe( flatMap( evt => throwError( `Cannot read file. ${file.name}.` ) ) );
      const data = obs.onLoad.pipe( map( evt => ( evt as any ).target.result as string ) );
      
      obs.reader.readAsText( file );
      return merge( data, failed ).pipe( takeUntil( obs.onLoadEnd ) );
    } )
  );
}
