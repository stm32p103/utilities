import { SvnClient, CheckoutOption, SvnGlobalOption, Depth, RevisionRange, UpdateOption } from './svn'

const sampleCredential = {
  username: 'cliuser',
  password: 'clipassword'
}

async function test() {
  try {
    const res = [];
    res.push( await client.checkout( new Depth( 'http://localhost/repos' ), 'K:/ws/svn/checkout', 
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

