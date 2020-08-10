import { Subject, from, pipe } from 'rxjs';
import { flatMap, map, filter } from 'rxjs/operators';

/**
 * `DataTransferItem`を文字列として取得するSubjectを返す関数。
 */
function createGetAsStringSubject( item: DataTransferItem ) {
  const subject = new Subject<string>();
  item.getAsString( result => {
    subject.next( result );
    subject.complete();
  } );
  return subject;
}

/**
 * `null`, `undefined`ではないことを確認する型ガード関数。
 * @param input チェック対象
 */
function isNotNullOrUndefined<T>(input: null | undefined | T): input is T {
  return input !== null && input !== undefined;
}

/**
 * Observable\<ClipboardEvent\> から、Observable\<DataTransferItem\>を生成するオペレータ。
 */
export function getDataTransferItem() {
  return pipe( 
    map( ( event: ClipboardEvent ) => event.clipboardData ),
    filter( isNotNullOrUndefined ),
    flatMap( data => from( data.items ) )
  );
}

/**
 * Observable\<DataTransferItem\>からペーストされた文字列のObservableを生成するオペレータ。
 */
export function getString( mimeType: RegExp | string = `/^text` ) {
  let tester: RegExp;
  if( typeof mimeType == 'string' ) {
    tester = /${mimeType}/;
  } else {
    tester = mimeType;
  }
  
  return pipe( 
    filter<DataTransferItem>( item => ( item.kind == 'string' ) && ( tester.test( item.type ) ) ),
    flatMap( item => createGetAsStringSubject( item ) )
  );
}

/**
 * Observable\<DataTransferItem\>からペーストされたファイルのObservableを生成するオペレータ。
 */
export function getFile( mimeType: RegExp | string ) {
  let tester: RegExp;
  if( typeof mimeType == 'string' ) {
    tester = /${mimeType}/;
  } else {
    tester = mimeType;
  }

  return pipe( 
    filter<DataTransferItem>( item => ( item.kind == 'file' ) && ( tester.test( item.type ) ) ),
    map( item => item.getAsFile() ),
    filter( isNotNullOrUndefined )
  );
}

/**
 * Observable\<DataTransferItem\>からペーストされた画像のObservableを生成するオペレータ。
 */
export function getImage() {
  return pipe( 
    getFile( /^image/ ),
    flatMap( file => from( createImageBitmap( file ) ) )
  );
}
