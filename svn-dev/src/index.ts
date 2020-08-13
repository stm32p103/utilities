import { asyncSpawn } from './spawn';
import { fromEvent, merge, throwError, Subject, Observable } from 'rxjs';
import { flatMap, takeUntil, map, toArray } from 'rxjs/operators';
import { Readable, Writable } from 'stream';
import { URL } from 'url';

import { SvnClient, CheckoutOption, SvnGlobalOption, Depth, RevisionRange, UpdateOption } from './svn'

const sampleCredential = {
  username: 'cliuser',
  password: 'clipassword'
}

async function test() {
  try {
    const res = [];
    res.push( await client.checkout( new Depth( 'http://localhost/repos', 'empty' ), 'K:/ws/svn/checkout', 
      new CheckoutOption( { 
      revision: new RevisionRange( 1 )
    } ) ) );

    res.push( await client.update( [
      new Depth( 'k:/ws/svn/checkout/sample'),
      new Depth( 'k:/ws/svn/checkout/package', 'immediates' )
    ], new UpdateOption( {
      revision: new RevisionRange( 'HEAD' )
    } ) ) );
    console.log( res.map( res => res.stdout ) );
  } catch( err ) {
    console.log( err.stderr );
  }
}

console.log( '------------' );
const client = new SvnClient( 'Shift_JIS', new SvnGlobalOption( sampleCredential ) );
test();
　