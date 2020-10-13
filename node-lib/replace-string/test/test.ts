import { replaceString } from '../src';

const data = {
  name: 'A',
  dimension: {
    height: 10,
    width: 20,
    length: 30
  },
  array: [ 1, 2, 3 ],
  weight: 100,
  valid: true
}

test('replaceKey', async () => {
  const template = '${name}: ${weight}kg';
  const res = replaceString( template, data );
  console.log( res );
  
  expect( res ).toEqual( 'A: 100kg' );
} );

test('array', async () => {
  const template = '${array[0]}, ${array[1]}, ${array[2]}';
  const res = replaceString( template, data );
  console.log( res );
  
  expect( res ).toEqual( '1, 2, 3' );
} );

test('escape', async () => {
  const template = '\\${name}';
  console.log( template);
  const res = replaceString( template, data );
  console.log( res );
  
  expect( res ).toEqual( '${name}' );
} );

test('replaceSubkey', async () => {
  let template = '${name}: ${dimension.height}x${dimension.width}x${dimension[length]}, valid: ${valid}';

  const res = replaceString( template, data );
  console.log( res );
  
  expect( res ).toEqual( 'A: 10x20x30, valid: true' );
} );

test('missing', async () => {
  let template = 'missing: ${invalid_data}';

  const res = replaceString( template, data );
  console.log( res );
  
  expect( res ).toEqual( 'missing: undefined' );
} );

test('object', async () => {
  let template = 'object: ${dimension}';

  const res = replaceString( template, data );
  console.log( res );
  
  expect( res ).toEqual( 'object: [object Object]' );
} );

test('null', async () => {
  let template = 'null: ${null}';

  const res = replaceString( template, null );
  console.log( res );
  
  expect( res ).toEqual( 'null: undefined' );
} );

test('undefined', async () => {
  let template = 'undefined: ${undefined}';

  const res = replaceString( template, undefined );
  console.log( res );
  
  expect( res ).toEqual( 'undefined: undefined' );
} );

test('string', async () => {
  let template = 'string: ${string}';

  const res = replaceString( template, 'test' );
  console.log( res );
  
  expect( res ).toEqual( 'string: undefined' );
} );

test('number', async () => {
  let template = 'number: ${number}';

  const res = replaceString( template, 'test' );
  console.log( res );
  
  expect( res ).toEqual( 'number: undefined' );
} );
