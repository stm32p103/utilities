// node
import { spawn } from 'child_process';
import { promises } from 'fs';

// rxjs
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

// my lib
import { TmpPool } from '@stm32p103/tmp-pool';

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
  revision?: number;                /// リビジョン
}

type TsvnImportOption = {
  logMessage?: string;
  from?: string;                    /// path
  to?: string;                      /// url
};

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
   * 一時ファイルに文字列をUTF16LEで書きこみ、パスを返す。
   * パスはオプション /pathfile や /logmsgfile で指定する。
   * @param data 書きこむ文字列。
   */
  private async writeTmpFile( data: string ) {
    let path = await this.tmpPool.acquire();
    await promises.writeFile( path, data, { encoding: 'utf16le' } );
    return path;
  }

  /**
   * 一時ファイルを開放する。削除はしない。
  */
  private releaseTmpFile( path: string ) {
    this.tmpPool.release( path );
  }

  /** 
   * 直前のコマンドが完了するまで待機する。 
   */
  async waitUntilComplete() {
    return await this.statusSubject.pipe( take(1) ).toPromise();
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
  about() {
    return this.spawn( 'about' );
  }

  /** 
   * /command:log を実行し、ログダイアログを表示する。
   * TBD: オプションに対応する。
   * @param path リポジトリURLまたは作業コピーのパス。
   * @returns 起動したTortoiseProcのpid。
   */
  async log( path: string ) {
    // 空白・2バイト文字は正常に引数で渡せないため、一時ファイルに書いてから与える。
    const pathfile = await this.writeTmpFile( path );
    const args: string[] = [ `/pathfile:${pathfile}` ];
    const res = this.spawn( 'log', args );

    // 一時ファイルを解放する。
    this.releaseTmpFile( pathfile );
    return res;
  }

  /**
   * チェックアウトダイアログを表示する。
   * @param option チェックアウト時のオプション。
   * @returns 起動したTortoiseProcのpid。
   */
  async checkout( option: TsvnCheckoutOption = {} ) {
    const args: string[] = [];

    if( option.from ) args.push( `/url:${encodeURI( option.from )}`);
    if( option.blockPathAdjustments ) args.push( '/blockpathadjustments');
    if( option.revision ) args.push( `/revision:${option.revision.toFixed(0)}`);

    let toPath: string;
    if( option.to ) {
      toPath = await this.writeTmpFile( option.to );
      args.push( `/pathfile:${toPath}` );
    }

    const res = this.spawn( 'checkout', args );

    // 一時ファイルを解放する。
    if( toPath ) this.releaseTmpFile( toPath );
    
    return res;
  }

  /**
   * 指定したパスを、指定したURLにコミットする。
   * パス、URLの指定が無ければ最後に使用したものが表示される。
   * @param option 
   * @returns 起動したTortoiseProcのpid。
   */
  async import( option: TsvnImportOption = {} ) {
    const args: string[] = [];

    // URLはエンコードしてからオプションで与える。
    if( option.to ) args.push( `/url:${encodeURI( option.to )}`);

    // メッセージを一時ファイルに保存し、logmsgfileオプションで与える。
    let logMsgFile: string;
    if( option.logMessage ) {
      logMsgFile = await this.writeTmpFile( option.logMessage );
      args.push( `/logmsgfile:${logMsgFile}` );
    }

    // import対象のパスを一時ファイルに保存し、pathfileオプションで与える。
    let pathFile: string;
    if( option.from ) {
      pathFile = await this.writeTmpFile( option.from );
      args.push( `/pathfile:${pathFile}`);
    }
    
    // TortoiseProcを起動する。
    const res = this.spawn( 'import', args );

    // 一時ファイルを解放する。
    if( logMsgFile ) this.releaseTmpFile( logMsgFile );
    if( pathFile ) this.releaseTmpFile( pathFile );

    return res;
  }

  /**
   * リビジョンや深さをUIで指定して更新する。
   * @param path svn updateを行うパス。
   * @returns 起動したTortoiseProcのpid。
   */
  async update( path: string ) {
    // update対象のパスを一時ファイルに保存し、pathfileオプションで与える。
    const pathFile = await this.writeTmpFile( path );
    const args: string[] = [ `/pathfile:${pathFile}`, '/rev' ];
    
    // TortoiseProcを起動する。
    const res = this.spawn( 'update', args );
    
    // 一時ファイルを解放する。
    this.releaseTmpFile( pathFile );

    return res;
  }

  /**
   * オプションで与えた設定を使って更新する。ダイアログは結果のみ表示する。
   * @param path svn updateを行うパス。
   * @param option 
   * @returns 起動したTortoiseProcのpid。
   */
  async updateWithoutUI( path: string, option: TsvnUpdateOption = {} ) {
    const args: string[] = [];
    
    // update対象のパスを一時ファイルに保存し、pathfileオプションで与える。
    const pathFile = await this.writeTmpFile( path );
    args.push( `/pathfile:${pathFile}` );

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
    this.releaseTmpFile( pathFile );

    return res;
  }

  /**
   * /command:commit を実行し、コミットダイアログを開く。
   * @param path コミット対象のパス。
   * @param option 
   * @returns 起動したTortoiseProcのpid。
   */
  async commit( path: string, option: TsvnCommitOption = {} ) {
    const args: string[] = [];

    const pathfile = await this.writeTmpFile( path );
    console.log( pathfile );
    args.push( `/pathfile:${pathfile}`);

    let logMsgFile: string;
    if( option.logMessage ) {
      logMsgFile = await this.writeTmpFile( option.logMessage );
      args.push( `/logmsgfile:${logMsgFile}` );
    }

    if( option.bugIds ) {
      const ids = option.bugIds.map( id => id.toFixed(0) ).join( ',' );
      args.push( `/bugid:${ids}`);
    }

    // TortoiseProcを起動する。
    const res = await this.spawn( 'commit', args );
    
    // 一時ファイルを解放する。
    this.releaseTmpFile( pathfile );
    if( logMsgFile ) this.releaseTmpFile( logMsgFile );

    return res;
  }

  /**
   * @param from コピー元の作業コピーまたはリポジトリURL
   * @param to コピー先のURL。先頭に^を付けた場合、リポジトリルートからの相対URLとみなされる。
   * @param option svn copyのオプション。
   */
  async copy( from: string, to: string, option: TsvnCopyOption = {} ) {
    const args: string[] = [ `/path:${from}`, `/url:${to}` ];

    if( option.switchAfterCopy ) args.push( '/switchaftercopy' );
    if( option.makeParents ) args.push( '/makeparents' );
    
    let logMsgFile: string;
    if( option.logMessage ) {
      logMsgFile = await this.writeTmpFile( option.logMessage );
      args.push( `/logmsgfile:${logMsgFile}` );
    }

    // TortoiseProcを起動する。
    const res = this.spawn( 'copy', args );

    // 一時ファイルを解放する。
    if( logMsgFile ) this.releaseTmpFile( logMsgFile );

    return res;
  }

  /**
   * TortoiseProcの終了コードのObservable。
   */
  get exitCode() {
    return this.statusSubject.asObservable();
  }
}
