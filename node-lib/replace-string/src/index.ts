import { get } from 'lodash';

function replaceBase( template: string, regexp: RegExp, replace: ( path: string ) => string ) {
  const substrings: string[] = [];
  let lastIndex = 0;

  let res: RegExpExecArray;
  while( res = regexp.exec( template ) ) {
    const value = replace( res[1] );
    // 置換しない文字列からエスケープ(\)を削除してから置換結果を連結し、substringにpush
    substrings.push( template.substr( lastIndex, res.index - lastIndex ).replace( '\\', '' ) + value );
    lastIndex = res.index + res[ 0 ].length;
  }

  // マッチしなかった残りを追加
  substrings.push( template.substr( lastIndex, template.length - lastIndex ).replace( '\\', '' ) );
  return substrings.join('');
}

const pathRegexp = /\$\{(([_a-zA-Z][_a-zA-Z0-9]*)(\.[_a-zA-Z][_a-zA-Z0-9]*)*)\}/g;
export function replaceString( template: string, obj: Object ) {
  return replaceBase( template, pathRegexp, path => get( obj, path ) );
}
