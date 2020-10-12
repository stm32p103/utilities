const regexp = /\$\{([_a-zA-Z][_a-zA-Z0-9]*)\}/g;

export type KeyValue = { [ key: string ]: string };

export function replaceString( template: string, kv: KeyValue ) {
  let tmp = template;
  let res: RegExpExecArray;
  while( res = regexp.exec( template ) ) {
    // res[0]: matched string
    // res[1]: sub match
    tmp = tmp.replace( res[ 0 ], kv[ res[ 1 ] ] );
  }
  return tmp; 
}
