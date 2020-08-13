import { asyncSpawn } from './spawn';
/* ############################################################################
 * Options
 * ######################################################################### */
interface SvnOption {
  format(): string[];
}

// HEAD: サーバの最新
// BASE: 作業コピーの元
// COMMITTED: 対象が変更された最後のリビジョン
// PREV: ↑の1つ前
type Revision = number | 'HEAD' | 'BASE' | 'COMMITTED' | 'PREV' | Date;
function formatRevision( rev: Revision ) {
  let res: string;
  if( typeof rev == 'number' ) {
    res = rev.toFixed().toString();
  } else if( rev instanceof Date ) {
    res = `{${rev.toTimeString}}`;
  } else {
    res = rev;
  }
  return res;
}

export class RevisionRange implements SvnOption {
  constructor( public readonly from: Revision, public readonly to?: Revision ) {}
  format() {
    let res = formatRevision( this.from );
    if( this.to ) {
      res = res + ':' + formatRevision( this.to );
    }
    return [ '--revision', res ];
  }
}

type DepthType = 'empty' | 'files' | 'immediates' | 'infinity';
export class Depth implements SvnOption {
  readonly url: string;
  constructor( url: URL | string, public readonly type: DepthType = 'infinity' ) {
    this.url = url.toString();
  }
  format() {
    return [ '--depth', this.type, this.url ];
  }
}



/**
 *  @class svn のグローバルオプション
 */
export class SvnGlobalOption implements SvnOption {
  readonly username?: string;                 // --username ARG
  readonly password?: string;                 // --password ARG
                                              // (omit) --password-from-stdin
  readonly noAuthCache?: boolean;             // --no-auth-cache
                                              // (always) --non-interactive
                                              // (omit) --force-interactive
  readonly trustServerCert?: boolean;         // --trust-server-cert
  readonly trustServerCertFailures?: boolean; // --trust-server-cert-failures
                                              // (omit) --config-dir ARG
                                              // (omit) --config-option ARG
  constructor( base: Partial<SvnGlobalOption> = {} ) {
    Object.assign( this, base );
  }

  format() {
    const res: string[] = [];
    if( this.username ) res.push( '--username', this.username );
    if( this.password ) res.push( '--password', this.password );
    if( this.noAuthCache ) res.push( '--no-auth-cache' );
    if( this.trustServerCert ) res.push( '--trust-server-cert' );
    if( this.trustServerCertFailures ) res.push(  '--trust-server-cert-failures' );
    res.push(  '--non-interactive' );
    return res;
  }
}

/**
 *  @class svn checkout のオプション
 */
export class CheckoutOption implements SvnOption {
  readonly force: boolean = false;
  readonly ignoreExternals: boolean = false;
  readonly revision?: RevisionRange;
  
  constructor( base: Partial<CheckoutOption> = {} ) {
    Object.assign( this, base );
  }
  format() {
    const res: string[] = [];
    if( this.force ) res.push( '--force' );
    if( this.ignoreExternals ) res.push( '--ignore-externals' );
    if( this.revision ) res.push( ...this.revision.format() );
    return res;
  }
}

type ResolutionAction = 'postpone'
  | 'working'
  | 'base' 
  | 'mine-conflict'
  | 'theirs-conflict'
  | 'mine-full'
  | 'theirs-full'
//| 'edit'
  | 'launch'
/**
 *  @class svn checkout のオプション
 */
export class UpdateOption implements SvnOption {
  readonly revision?: RevisionRange;
  // (omit) depth
  readonly setDepth?: Depth;
  // (omit) quite
  // (omit) diff3-cmd
  readonly force: boolean = false;
  readonly ignoreExternals: boolean = false;
  // (omit) changelist
  // (omit) editor-cmd
  // (omit) accept: always postpone
  // (always) parent
  // (omit) add-as-modification

  constructor( base: Partial<UpdateOption> = {} ) {
    Object.assign( this, base );
  }

  format() {
    const res: string[] = [];
    if( this.revision ) res.push( ...this.revision.format() );
    if( this.setDepth ) res.push( ...this.setDepth.format() );
    if( this.force ) res.push( '--force' );
    if( this.ignoreExternals ) res.push( '--ignore-externals' );
    res.push( '--parents' );
    res.push( '--accept', 'postpone' );
    return res;
  }
}

/**
 *  @class SVN Client
 */
export class SvnClient {
  private option: string[];
  constructor( private encoding: string = 'utf8',
               option: SvnGlobalOption = new SvnGlobalOption() ) {
    this.option = option.format();
  }
  private async execute( command: string, option: ( string | string[] | SvnOption )[] ) {
    const init: string[] = [ command, ...this.option ];
    let optionStrings: string[] = option.reduce( ( prev: string[], curr ) => {
      if( typeof curr == 'string' ) {
        prev.push( curr );
      } else if( curr instanceof Array ) {
        prev.push( ...curr );
      } else {
        prev.push( ...curr.format() );
      }
      return prev;
    }, init ) as string[];

    try {
      return asyncSpawn( this.encoding, 'svn', optionStrings );
    } catch( err ) {
      throw new Error( err.stderr );
    };
  }

  /**
   * @param depth SVNサーバのURLと深さを選択する。後からupdateでフォルダ・深さを広げることは可能。狭めることはできない。
   * @param path チェックアウト先のフォルダのパスを指定する。
   * @param option チェックアウト時のオプションを指定する。
   * @returns 終了コード, stdout, stderrの出力を返す。
   */
  async checkout( depth: Depth, path: string, option: CheckoutOption = new CheckoutOption() ) {
    return this.execute( 'checkout', [ depth, option, path ] );
  }

  /**
   * @param depth 更新対象の作業コピーのパスと深さを指定する。複数設定可能。
   * @param option 更新時のオプションを指定する。
   * @returns 終了コード, stdout, stderrの出力を返す。
   */
  async update( depth: Depth | Depth[], option: UpdateOption = new UpdateOption() ) {
    const depthList = ( depth instanceof Array ) ? depth : [ depth ];
    return this.execute( 'update', [ option, ...depthList.map( depth => depth.format() ) ] );
  }

}
