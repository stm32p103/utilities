import { throwError, merge } from 'rxjs';
import { map, flatMap, takeUntil } from 'rxjs/operators';
import { ObservableFileReader } from './observable-file-reader';

// ファイルを読み込むObservableを返す
// 何らかの理由で中断したら例外を投げる
export const readAsText = ( file: File ) => {
  const reader = new ObservableFileReader();
  const failed = merge( reader.onAbort, reader.onError ).pipe( flatMap( evt => throwError( `Cannot read file. ${file.name}.` ) ) );
  const data = reader.onLoad.pipe( map( evt => ( evt as any ).target.result as string ) );
      
  reader.readAsText( file );
  return merge( data, failed ).pipe( takeUntil( reader.onLoadEnd ) );
}


export const readAsDataURL = ( file: File ) => {
  const reader = new ObservableFileReader();
  
  const failed = merge( reader.onAbort, reader.onError ).pipe( flatMap( evt => throwError( `Cannot read file. ${file.name}.` ) ) );
  const data = reader.onLoad.pipe( map( evt => ( evt as any ).target.result as string ) );

  reader.readAsDataURL( file );
  return merge( data, failed ).pipe( takeUntil( reader.onLoadEnd ) );
}