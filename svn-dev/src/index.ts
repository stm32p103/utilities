import { SvnClient, SvnCheckoutOption, SvnGlobalOption, Depth, RevisionRange, SvnUpdateOption } from './svn'

const sampleCredential = {
  username: 'cliuser',
  password: 'clipassword'
}

async function test() {
  try {
    /*
    const res = [];
    res.push( await client.checkout( new Depth( 'http://localhost/repos' ), 'K:/ws/svn/checkout', 
      new SvnCheckoutOption( { 
      revision: new RevisionRange( 1 )
    } ) ) );

    res.push( await client.update( [
      new Depth( 'k:/ws/svn/checkout/sample'),
      new Depth( 'k:/ws/svn/checkout/package', 'immediates' )
    ], new SvnUpdateOption( {
      revision: new RevisionRange( 'HEAD' )
    } ) ) );
    */
    let log = await client.info( 'K:/ws/svn/checkout/sample/a00-01' );
    console.dir( log, { depth: null } );
    
    log = await client.info( 'http://localhost/repos/sample/a00-01' );
    console.dir( log, { depth: null } );
  } catch( err ) {
    console.error( 'err' );
    console.error( err );
  }
}

console.log( '------------' );
const client = new SvnClient( 'Shift_JIS', new SvnGlobalOption( sampleCredential ) );
test();

