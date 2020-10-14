export function query2string( query: { [ key: string ]: any } ) {
  let queryString = '';
  let queries: string[] = [];

  // undefined or null -> ''
  if( !query ) {
    return queryString;
  }

  for( let key in query ) {
    const value = query[key];
    let valueString = '';
    if( value ) {
      if( value instanceof Array ) {
        valueString = value.map( v => v.toString() ).join(',');
      } else {
        valueString = value.toString();
      }
      queries.push( key + '=' + query[key] ); 
    }
  }

  if( queries.length > 0 ) {
    queryString = '?' + queries.join( '&' );
  }

  return queryString;
}
