import { SvnClient, SvnGlobalOption } from './svn'
import { TmpFileManager } from './tmp';
import { promises, writeFile } from 'fs';

import { TortoiseSvnLauncher } from './proc'
const sampleCredential = {
  username: 'cliuser',
  password: 'clipassword'
}
 
async function test() {
  try {
    // const tmpFile = await createTmpFile( { prefix: 'svn', discardDescriptor: true } );
    // console.log( tmpFile.path )
    // await promises.writeFile( tmpFile.path, `file:${tmpFile.descriptor}`, { encoding: 'utf8' } );
    // const x = await promises.readFile( tmpFile.path, { encoding: 'utf8' } );
    // console.log( x )

    const mng = new TmpFileManager();
    const path1 = await mng.acquire();
    const path2 = await mng.acquire();
    
    console.log( path1 );
    console.log( path2 );
    await promises.writeFile( path1, `file1`, { encoding: 'utf8' } );
    await promises.writeFile( path2, `file2`, { encoding: 'utf8' } );
    mng.release( path1 );

    let path3 = await mng.acquire();
    console.log( path3 );
    mng.removeUnused();
    await promises.writeFile( path3, `file3`, { encoding: 'utf8' } );
    mng.release( path3 );
    mng.release( path2 );
    mng.removeUnused();
    
    // const launcher = new TortoiseSvnLauncher();
    // launcher.exitCode.subscribe( code => console.log( code ) );
    // let pid;
    // const url = normalize( 'k:\\ws\\svn\\a b' );
    // console.log( url.toString() );

    // launcher.commit( url, { logMessage: 'test "quoted" and spaced. \n and new line "ok?".' } )
    // pid = launcher.checkout( { from: 'http://localhost/repos', to: url.toString(), revision: 4 } );

    /* 
    let pid = launcher.about();
    console.log( pid );

    pid = launcher.import( {
      from: 'k:/ws/sample',
      to: 'http://localhost/repos/imported',
      logMessage: `import from k:/ws/sample.`
    } );
    pid = launcher.checkout( { from: 'http://localhost/repos', to: 'k:/ws/svn/ui-checkout', revision: 4 } );

    pid = launcher.log( 'http://localhost/repos/sample/a00-03' );
    console.log( pid );


    pid = launcher.copy( 'http://localhost/repos/sample/a00-03', '^/sample/a00-04', {
      logMessage: 'create branch',
      makeParents: false
    } );
    console.log( pid );
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
    console.log( pid );
    pid = launcher.commit( 'K:\\ws\\svn\\repos\\' );
    console.log( pid );
    

    let log = await client.info( 'K:/ws/svn/checkout/sample/a00-01' );
    console.dir( log, { depth: null } );
    
    log = await client.info( 'http://localhost/repos/sample/a00-01' );
    console.dir( log, { depth: null } );
    */

  } catch( err ) {
    console.error( 'err' );
    console.error( err );
  }
}

console.log( '------------' );
const client = new SvnClient( 'Shift_JIS', new SvnGlobalOption( sampleCredential ) );
test(); 
