import { TmpPool } from '.'
import * as fs from 'fs';

const prefix = 'sample';
const pool = new TmpPool( { prefix: prefix } );
const tmpDir = process.env[ 'tmp' ];
const sampleText = '123456789';

test( 'acquire', async () => {
  // 一時ファイルを取得できることを確認する
  const path = await pool.acquire();
  console.log( `Acquired: ${path}`);
  expect( path ).toMatch( tmpDir + '\\' + prefix );

  // 一時ファイルが存在することを確認する
  fs.writeFileSync( path, sampleText, { encoding: 'utf16le' } );
  const readText = fs.readFileSync( path, { encoding: 'utf16le' } );
  console.log( `Write: ${sampleText}`);
  console.log( `Read: ${readText}`);
  expect( readText ).toEqual( sampleText );

  // 存在しない一時ファイルのパスを解放することを確認する
  const releaseNonExistent = pool.release( path + 'dummy-path' );
  console.log( `Remaining tmp files: ${releaseNonExistent}`);
  expect( releaseNonExistent ).toEqual( 0 );

  // 存在する一時ファイルのパスを解放することを確認する
  const releaseExistent = pool.release( path );
  console.log( `Remaining tmp files: ${releaseExistent}`);
  expect( releaseExistent ).toEqual( 1 );

  // 保持しているファイルを再取得することを確認する
  const reAcquire = await pool.acquire();
  const reReadText = fs.readFileSync( path, { encoding: 'utf16le' } );
  console.log( `Re-acquired path: ${reAcquire}`);
  console.log( `First path: ${path}`);
  expect( reAcquire ).toEqual( path );
  expect( reReadText ).toEqual( sampleText );

  // 使用していない一時ファイルを削除したことを確認する。
  pool.release( reAcquire );
  pool.removeUnused();
  expect( () => fs.readFileSync( reAcquire, { encoding: 'utf16le' } ) ).toThrow();

  // 使用中の一時ファイルを削除したことを確認する。
  const pathToRemove = await pool.acquire();
  pool.removeAll();
  expect( () => fs.readFileSync( pathToRemove, { encoding: 'utf16le' } ) ).toThrow();
} );
