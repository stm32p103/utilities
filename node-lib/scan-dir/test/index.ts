import { scanDir } from '../dist';
import * as Path from 'path';

const expectedPaths = [
  'test\\sample\\file1.txt',
  'test\\sample\\file2.txt',
  'test\\sample\\sub',
  'test\\sample\\sub\\sub1.txt',
  'test\\sample\\sub\\sub2.txt'
];

const expectedFilePaths = [
  'test\\sample\\file1.txt',
  'test\\sample\\file2.txt',
  'test\\sample\\sub\\sub1.txt',
  'test\\sample\\sub\\sub2.txt'
];

const expectedSubPaths = [
  'test\\sample\\sub\\sub1.txt',
  'test\\sample\\sub\\sub2.txt'
];

test('all dirs and files', async () => {
  const result = await scanDir( 'test/sample' );
  expect( result ).toEqual( expect.arrayContaining( expectedPaths ) );

  console.log( result );
} );

test('all files', async () => {
  const result = await scanDir( 'test/sample', ( dir, path ) => !dir.isDirectory() );
  expect( result ).toEqual( expect.arrayContaining( expectedFilePaths ) );
} );


test('files under sub dir', async () => {
  const result = await scanDir( 'test/sample', ( dir, path ) => {
    const name = Path.parse( path ).base;
    return name == 'sub';
  } );
  expect( result ).toEqual( expect.arrayContaining( expectedSubPaths ) );
} );
