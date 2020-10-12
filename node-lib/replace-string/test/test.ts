import { replaceString } from '../src';

test('replace', async () => {
  const data = {
    name: 'A',
    height: '10',
    width: '20',
    length: '30'
  }
  let template = '${name}: ${height}x${width}x${length}';

  const res = replaceString( template, data );
  console.log( res );
  
  expect( res ).toEqual( 'A: 10x20x30' );
} );
