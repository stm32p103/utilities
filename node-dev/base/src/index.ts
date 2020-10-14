import { scanDir } from '@stm32p103/scan-dir';
import { parse } from 'path';

async function removeHeader( root: string ) {
  let files = await scanDir( root, ( dirent ) => dirent.isFile() );
  let header = /^.+-/;    // 先頭から-までマッチ

  files.forEach( file => {
    const parsed = parse( file );
    const removed = parsed.name.replace( header, '' ) + parsed.ext;
    console.log( removed );
  } );
}

const root = process.argv[2];
if( root ) {
  removeHeader( process.argv[ 2 ] ).catch( ( err ) => {
    console.error( err.message );
  } );
}
