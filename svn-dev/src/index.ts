import { SvnClient, SvnGlobalOption } from './svn'
import { TortoiseSvnLauncher } from './proc'
const sampleCredential = {
  username: 'cliuser',
  password: 'clipassword'
}
const client = new SvnClient( 'Shift_JIS', new SvnGlobalOption( sampleCredential ) );

const url = 'http://localhost/repos/日本語';
const path = 'K:/ws/svn/ぱす';
const logMsg = `TEST-1 日本語でメッセージが書ける。
改行もできる。`;

async function test() {
  try {
    let pid = 0;
    const launcher = new TortoiseSvnLauncher();

    pid = await launcher.checkout( { from: url, to: path } );
    await launcher.waitUntilComplete();

    pid = await launcher.update( path );
    await launcher.waitUntilComplete();

    pid = await launcher.commit( path, { 
      logMessage: logMsg
    } );
    
    await launcher.waitUntilComplete();
    launcher.removeAllTmpFiles();
    
    let log = await client.info( 'K:/ws/svn/checkout/sample' );
    console.dir( log, { depth: null } );
  } catch( err ) {
    console.error( 'err' );
    console.error( err );
  }
}

console.log( '------------' );
test(); 
