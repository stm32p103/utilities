// node
import { spawn } from 'child_process';

// rxjs
import { Subject } from 'rxjs';
import { take, filter } from 'rxjs/operators';

// my lib
import { TmpPool } from '@stm32p103/tmp-pool';
import { TmpFiles } from './tmp';
// ############################################################################
type TsvnExitCode = {
  pid: number;
  code: number;
  signal: string;
}

type TsvnUpdateOption =  {
  revision?: number;
  ignoreExternals?: boolean;
  nonRecursive?: boolean;
  stickyDepth?: boolean;
  skipPreChecks?: boolean;
};

type TsvnCommitOption = {
  logMessage?: string;
  bugIds?: number[];
}

type TsvnCopyOption = {
  logMessage?: string;
  switchAfterCopy?: boolean;
  makeParents?: boolean;
};

type TsvnCheckoutOption = {
  from?: string;                    /// チェックアウト元URL
  to?: string;                      /// チェックアウト先パス
  blockPathAdjustments?: boolean;   /// チェックアウト先パスの自動調整の抑制
  revision?: string | number;       /// リビジョン
}

type TsvnImportOption = {
  logMessage?: string;
  from?: string;                    /// path
  to?: string;                      /// url
};

type TsvnMergeUrl = {
  url: string;
  revision?: string | number;
}

function revision2string( rev: number | string ) {
  if( typeof rev == 'string' ) {
    return rev;
  } else {
    return rev.toFixed(0);
  }
}

const pathEncoding: BufferEncoding = 'utf16le';
const messageEncoding: BufferEncoding = 'utf8';


/**
 * @class TortoiseProcのコマンドを起動するクラス。TortoiseProcについては以下URL参照。
 * https://tortoisesvn.net/docs/release/TortoiseSVN_ja/tsvn-automation.html
 */
export class TortoiseSvnLauncher {
  private statusSubject = new Subject<TsvnExitCode>();
  private tmpPool = new TmpPool();

  constructor( private tortoiseProc: string = 'TortoiseProc' ) {}

  /**
   * child_process を使って、TortoiseProcを起動する。
   * @param command /command: で指定するTortoiseProcのコマンド。
   * @param options
   * @returns 起動したTortoiseProcのpid。
   */
  private spawn( command: string, options: string[] = [] ) {
    const proc = spawn( this.tortoiseProc, [ `/command:${command}`, ...options ], { detached: true, shell: true } );
    const pid = proc.pid;
    proc.on( 'close', ( code, signal ) => {
      this.statusSubject.next( {
        code: code,
        signal: signal,
        pid: pid
      } );
    } );
    return proc.pid;
  }

  /** 
   * 指定したPIDのプロセスが完了するまで待機する。 
   */
  async waitUntilComplete( pid: number ) {
    return await this.statusSubject.pipe( filter( status => status.pid == pid ), take(1) ).toPromise();
  }
  
  /** 
   * 一時ファイルを全て削除する。
   */
  removeAllTmpFiles() {
    this.tmpPool.removeAll();
  }

  /** 
   * /command:about を実行し、「バージョン情報」ダイアログを表示する。 
   * @returns 起動したTortoiseProcのpid。
   */
  async about() {
    // 他のコマンドと使い方を合わせられるよう、あえてasyncにしている。
    return this.spawn( 'about' );
  }

  /** 
   * /command:log を実行し、ログダイアログを表示する。
   * TBD: オプションに対応する。
   * @param path リポジトリURLまたは作業コピーのパス。
   * @returns 起動したTortoiseProcのpid。
   */
  async log( path: string ) {
    const tmp = new TmpFiles( this.tmpPool );
    const args: string[] = [];
    // 空白・2バイト文字は正常に引数で渡せないため、一時ファイルに書いてから与える。
    if( path ) args.push( `/pathfile:${ await tmp.create( path, pathEncoding ) }` );
    const res = this.spawn( 'log', args );

    // 一時ファイルを解放する。
    tmp.dispose();
    return res;
  }

  /**
   * チェックアウトダイアログを表示する。
   * @param option チェックアウト時のオプション。
   * @returns 起動したTortoiseProcのpid。
   */
  async checkout( option: TsvnCheckoutOption = {} ) {
    const tmp = new TmpFiles( this.tmpPool );
    const args: string[] = [];

    if( option.from ) args.push( `/url:${encodeURI( option.from )}`);
    if( option.blockPathAdjustments ) args.push( '/blockpathadjustments');
    if( option.revision ) args.push( `/revision:${revision2string(option.revision)}`);

    if( option.to ) args.push( `/pathfile:${ await tmp.create( option.to, pathEncoding ) }` );

    console.log( option.to );
    console.log( args );
    // TortoiseProcを起動する。
    const res = this.spawn( 'checkout', args );

    // 一時ファイルを解放する。
    tmp.dispose();

    return res;
  }

  /**
   * 指定したパスの内容を、指定したURLにコミットする。
   * パス、URLの指定が無ければ最後に使用したものが表示される。
   * @param option 
   * @returns 起動したTortoiseProcのpid。
   */
  async import( option: TsvnImportOption = {} ) {
    const tmp = new TmpFiles( this.tmpPool );
    const args: string[] = [];

    // URLはエンコードしてからオプションで与える。
    if( option.to ) args.push( `/url:${encodeURI( option.to )}`);

    // 一時ファイルに保存し、パスをオプションに与える。
    if( option.logMessage ) args.push( `/logmsgfile:${ await tmp.create( option.logMessage, messageEncoding ) }` );
    if( option.from ) args.push( `/pathfile:${ await tmp.create( option.from, pathEncoding ) }` );

    // TortoiseProcを起動する。
    const res = this.spawn( 'import', args );

    // 一時ファイルを解放する。
    tmp.dispose();

    return res;
  }

  /**
   * リビジョンや深さをUIで指定して更新する。
   * @param path svn updateを行うパス。
   * @returns 起動したTortoiseProcのpid。
   */
  async update( path: string ) {
    const tmp = new TmpFiles( this.tmpPool );
    const args: string[] = [ '/rev' ];

    // update対象のパスを一時ファイルに保存し、pathfileオプションで与える。
    if( path ) args.push( `/pathfile:${ await tmp.create( path, pathEncoding ) }` );
    
    // TortoiseProcを起動する。
    const res = this.spawn( 'update', args );
    
    // 一時ファイルを解放する。
    tmp.dispose();

    return res;
  }

  /**
   * オプションで与えた設定を使って更新する。ダイアログは結果のみ表示する。
   * @param path svn updateを行うパス。
   * @param option 
   * @returns 起動したTortoiseProcのpid。
   */
  async updateWithoutUI( path: string, option: TsvnUpdateOption = {} ) {
    const tmp = new TmpFiles( this.tmpPool );
    const args: string[] = [];
    
    // update対象のパスを一時ファイルに保存し、pathfileオプションで与える。
    if( path ) args.push( `/pathfile:${ await tmp.create( path, pathEncoding ) }` );

    if( option.nonRecursive ) args.push( '/nonrecursive' );
    if( option.stickyDepth ) args.push( '/stickydepth' );
    if( option.skipPreChecks ) args.push( '/skipprechecks' );
    if( option.revision !== undefined ) args.push( `/rev:${option.revision.toFixed(0)}`);
    if( option.ignoreExternals ) {
      args.push( '/ignoreexternals' );
    } else {
      args.push( '/includeexternals' );
    }

    // TortoiseProcを起動する。
    const res = this.spawn( 'update', args );

    // 一時ファイルを解放する。
    tmp.dispose();

    return res;
  }

  /**
   * /command:commit を実行し、コミットダイアログを開く。
   * @param path コミット対象のパス。
   * @param option 
   * @returns 起動したTortoiseProcのpid。
   */
  async commit( path: string, option: TsvnCommitOption = {} ) {
    const tmp = new TmpFiles( this.tmpPool );
    const args: string[] = [];

    if( path ) args.push( `/pathfile:${ await tmp.create( path, pathEncoding ) }` );
    if( option.logMessage ) args.push( `/logmsgfile:${ await tmp.create( option.logMessage, messageEncoding ) }` );

    if( option.bugIds ) args.push( `/bugid:${option.bugIds.map( id => id.toFixed(0) ).join( ',' )}`);

    // TortoiseProcを起動する。
    const res = await this.spawn( 'commit', args );
    
    // 一時ファイルを解放する。
    tmp.dispose();

    return res;
  }

  /**
   * /path で指定されたファイルをバージョン管理に追加する。
   * @param path バージョン管理に追加するファイルのパス
   */
  async add( paths: string[] ) {
    const tmp = new TmpFiles( this.tmpPool );
    const args: string[] = [];

    // import対象のパスを一時ファイルに保存し、pathfileオプションで与える。
    if( paths ) args.push( `/pathfile:${ await tmp.create( paths.join('\n'), pathEncoding ) }` );
    
    // TortoiseProcを起動する。
    const res = await this.spawn( 'add', args );

    // 一時ファイルを解放する。
    tmp.dispose();

    return res;
  }
  
  async revert( path: string ) {
    const tmp = new TmpFiles( this.tmpPool );
    const args: string[] = [];

    if( path ) args.push( `/pathfile:${ await tmp.create( path, pathEncoding ) }` );
    
    // TortoiseProcを起動する。
    const res = await this.spawn( 'revert', args );

    // 一時ファイルを解放する。
    tmp.dispose();

    return res;
  }

  // cleanup
  // resolve
  // repocreate
  // switch
  // export
  // dropexport
  // dropvendor
  
  /**
   * 共通の祖先をもつブランチをマージする。
   */
  async mergeRangeOfRevision( path: string, from: string ) {
    const tmp = new TmpFiles( this.tmpPool );
    const args: string[] = [ `/fromurl:${encodeURI(from)}` ];
    if( path ) args.push( `/pathfile:${ await tmp.create( path, pathEncoding ) }` );

    // TortoiseProcを起動する。
    const res = this.spawn( 'merge', args );

    // 一時ファイルを解放する。
    tmp.dispose();

    return res;
  }

  /** 
   * 異なる2つのツリーをマージする。
  */
  async mergeDifferentTrees( path: string, from: TsvnMergeUrl | string, to: TsvnMergeUrl) {
    const tmp = new TmpFiles( this.tmpPool );
    const args: string[] = [];
    
    // 始点: fromurl, fromrev 
    let fromUrl: string
    if( typeof from == 'string' ) {
      fromUrl = from;
    } else {
      fromUrl = from.url;
      if( from.revision) args.push( `/fromrev:${revision2string(from.revision)}`);
    }
    args.push( `/fromurl:${encodeURI(fromUrl)}` );

    // 終点: tourl, torev
    let toUrl: string;
    if( typeof to == 'string' ) {
      toUrl = to;
    } else {
      toUrl = to.url;
      if( to.revision)  args.push( `/fromrev:${revision2string(to.revision)}`);
    }
    args.push( `/tourl:${encodeURI(toUrl)}` );

    if( path ) args.push( `/pathfile:${ await tmp.create( path, pathEncoding ) }` );

    // TortoiseProcを起動する。
    const res = this.spawn( 'merge', args );

    // 一時ファイルを解放する。
    tmp.dispose();

    return res;
  }

  /**
   * @param fromPathOrUrl コピー元の作業コピーまたはリポジトリURL
   * @param toUrl コピー先のURL。先頭に^を付けた場合、リポジトリルートからの相対URLとみなされる。
   * @param option svn copyのオプション。
   */
  async copy( fromPathOrUrl: string, toUrl: string, option: TsvnCopyOption = {} ) {
    const tmp = new TmpFiles( this.tmpPool );
    const args: string[] = [ `/url:${encodeURI(toUrl)}` ];

    if( option.switchAfterCopy ) args.push( '/switchaftercopy' );
    if( option.makeParents ) args.push( '/makeparents' );
    if( fromPathOrUrl ) args.push( `/pathfile:${ await tmp.create( fromPathOrUrl, pathEncoding ) }` );
    if( option.logMessage ) args.push( `/logmsgfile:${ await tmp.create( option.logMessage, messageEncoding ) }` );

    // TortoiseProcを起動する。
    const res = this.spawn( 'copy', args );

    // 一時ファイルを解放する。
    tmp.dispose();

    return res;
  }

  /**
   * TortoiseProcの終了コードのObservable。
   */
  get exitCode() {
    return this.statusSubject.asObservable();
  }
}

