import { SvnClient, SvnGlobalOption } from './cli'
import { TortoiseSvnLauncher } from './proc'
const sampleCredential = {
  username: 'cliuser',
  password: 'clipassword'
}
const client = new SvnClient( 'Shift_JIS', new SvnGlobalOption( sampleCredential ) );

const url = 'http://localhost/repos/日本語';
const importPath = 'k:/ws/svn/import';
const checkoutPath = 'K:/ws/svn/ch';
const logMsg = `TEST-1 日本語でメッセージが書ける。
改行もできる。`;

const urlCopyFrom = 'http://localhost/repos/copy/copy dir';
const urlCopyTo = 'http://localhost/repos/copy/spaced copy dir';


const mergePath = 'K:/ws/svn/checkout/package';
const urlMergeFrom = 'http://localhost/repos/copy/2';

async function test() {
  try {
    let pid = 0;
    const launcher = new TortoiseSvnLauncher();

    /*
    pid = await launcher.mergeRangeOfRevision( mergePath,urlMergeFrom );
    await launcher.waitUntilComplete( pid );

    pid = await launcher.mergeDifferentTrees( mergePath, { url: urlCopyFrom }, { url: urlCopyTo } );
    await launcher.waitUntilComplete( pid );

    pid = await launcher.log( url );
    await launcher.waitUntilComplete( pid );
    
    pid = await launcher.checkout( { from: url, to: checkoutPath } );
    await launcher.waitUntilComplete( pid );

    pid = await launcher.log( checkoutPath );
    await launcher.waitUntilComplete( pid );

    pid = await launcher.import( { to: url, from: importPath, logMessage: logMsg } );
    await launcher.waitUntilComplete( pid );

    pid = await launcher.update( checkoutPath );
    await launcher.waitUntilComplete( pid );

    pid = await launcher.commit( checkoutPath, { logMessage: logMsg, bugIds: [ 1, 2, 3 ] } );
    await launcher.waitUntilComplete( pid );

    */

   pid = await launcher.copy( urlCopyFrom, urlCopyTo, { logMessage: logMsg, makeParents: true } );
   await launcher.waitUntilComplete( pid );
    /*
    let log = await client.info( 'K:/ws/svn/checkout/sample' );
    console.dir( log, { depth: null } );
    */
  } catch( err ) {
    console.error( 'err' );
    console.error( err );
  }
}

console.log( '------------' );
test(); 
