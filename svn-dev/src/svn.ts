import { asyncSpawn } from './spawn';
import { getLog } from './log';
import { getInfo } from './info';

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
export class SvnCheckoutOption implements SvnOption {
  readonly force: boolean = false;
  readonly ignoreExternals: boolean = false;
  readonly revision?: RevisionRange;
  
  constructor( base: Partial<SvnCheckoutOption> = {} ) {
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

/**
 *  @class svn update のオプション
 */
export class SvnUpdateOption implements SvnOption {
  readonly revision?: RevisionRange;
  // (param) depth
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

  constructor( base: Partial<SvnUpdateOption> = {} ) {
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
 *  @class svn info のオプション
 */
export class SvnInfoOption implements SvnOption {
  public readonly revision: RevisionRange;
  public readonly recursive: boolean;
  // (omit) depth
  // (omit) target
  // (omit) incremental
  // (always) xml
  // (omit) changelist
  public readonly includeExternals: boolean;
  // (omit) show-item
  // (omit) no-newline
  // (omit) x-viewspec

  constructor( base: Partial<SvnInfoOption> = {} ) {
    Object.assign( this, base );
  }
  format() {
    const res: string[] = [];
    if( this.revision ) res.push( ...this.revision.format() );
    if( this.recursive ) res.push( '--recursive' );
    res.push( '--xml' );
    if( this.includeExternals ) res.push( '--include-externals' );
    return res;
  }
}

/**
 *  @class svn log のオプション
 */
export class SvnLogOption implements SvnOption {
  readonly revision?: RevisionRange;
  // (omit) change
  // (omit) quite
  // (always) verbose
  // (always) use-merge-history
  // (omit) path
  readonly stopOnCopy?: boolean;
  // (omit) incremental
  // (always) xml
  // (omit) limit
  // (always) with-all-revprops
  // (omit) with-no-revprops
  // (omit) with-revprop
  // (omit) depth
  // (omit) diff
  // (omit) diff-cmd
  // (omit) internal-diff
  // (omit) extensions
  // (omit) search
  // (omit) search-and

  constructor( base: Partial<SvnLogOption> = {} ) {
    Object.assign( this, base );
  }

  format() {
    const res: string[] = [];
    if( this.revision ) res.push( ...this.revision.format() );
    if( this.stopOnCopy ) res.push( '--stop-on-copy' );
    res.push( '--verbose' );
    res.push( '--use-merge-history' );
    res.push( '--xml' );
    res.push( '--with-all-revprops' );
    return res;
  }
}


/**
 *  @class SVN Client
 *  * \[-]  add
 *  * \[-]  auth
 *  * \[-]  blame (praise, annotate, ann)
 *  * \[-]  cat
 *  * \[-]  changelist (cl)
 *  * \[x]  checkout (co)
 *  * \[-]  cleanup
 *  * \[-]  commit (ci)
 *  * \[-]  copy (cp)
 *  * \[-]  delete (del, remove, rm)
 *  * \[-]  diff (di)
 *  * \[-]  export
 *  * \[-]  help (?, h)
 *  * \[-]  import
 *  * \[x]  info
 *  * \[-]  list (ls)
 *  * \[-]  lock
 *  * \[x]  log
 *  * \[-]  merge
 *  * \[-]  mergeinfo
 *  * \[-]  mkdir
 *  * \[-]  move (mv, rename, ren)
 *  * \[-]  patch
 *  * \[-]  propdel (pdel, pd)
 *  * \[-]  propedit (pedit, pe)
 *  * \[-]  propget (pget, pg)
 *  * \[-]  proplist (plist, pl)
 *  * \[-]  propset (pset, ps)
 *  * \[-]  relocate
 *  * \[-]  resolve
 *  * \[-]  resolved
 *  * \[-]  reversvn
 *  * \[-]  status (stat, st)
 *  * \[-]  switch (sw)
 *  * \[-]  unlock
 *  * \[x]  update (up)
 *  * \[-]  upgrade
 *  * \[-]  x-shelf-diff
 *  * \[-]  x-shelf-drop
 *  * \[-]  x-shelf-list (x-shelves)
 *  * \[-]  x-shelf-list-by-paths
 *  * \[-]  x-shelf-log
 *  * \[-]  x-shelf-save
 *  * \[-]  x-shelve
 *  * \[-]  x-unshelve
 *  * \[-]  x-wc-copy-mods
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

    // --xml オプション使用時は UTF8を使用する
    let encoding = this.encoding;
    if( optionStrings.indexOf( '--xml' ) ) {
      encoding = 'utf8';
    }

    try {
      return asyncSpawn( 'svn', optionStrings, { encoding: encoding } );
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
  async checkout( depth: Depth, path: string, option: SvnCheckoutOption = new SvnCheckoutOption() ) {
    return this.execute( 'checkout', [ depth, option, path ] );
  }

  /**
   * @param depth 更新対象の作業コピーのパスと深さを指定する。複数設定可能。
   * @param option 更新時のオプションを指定する。
   * @returns 終了コード, stdout, stderrの出力を返す。
   */
  async update( depth: Depth | Depth[], option: SvnUpdateOption = new SvnUpdateOption() ) {
    const depthList = ( depth instanceof Array ) ? depth : [ depth ];
    return this.execute( 'update', [ option, ...depthList.map( depth => depth.format() ) ] );
  }

  /**
   * @param urlOrPath URLまたは作業コピーのパス。URLの場合はURL以下の変更を返す。パスの場合はパスに対する変更のみを返す。
   * @param option ログのオプションを指定する。diff, searchなどは未実装。
   */
  async log( urlOrPath: URL | string, option: SvnLogOption = new SvnLogOption() ) {
    const res = await this.execute( 'log', [ ...option.format(), urlOrPath.toString() ] );
    const log = getLog( res.stdout );
    return log;
  }

  async info( urlOrPathList: string | URL | ( string | URL )[], option: SvnInfoOption = new SvnInfoOption() ) {
    const list = ( urlOrPathList instanceof Array ) ? urlOrPathList : [ urlOrPathList ];
    const res = await this.execute( 'info', [ ...option.format(), list.map( urlOrPath => urlOrPath.toString() ) ] );
    const log = getInfo( res.stdout );
    return log;
  }
}
