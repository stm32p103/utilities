import { JSDOM } from 'jsdom';

type SvnLogEntry = {
  revision: string;
  author: string;
  date: Date;
  message: string;
  paths: SvnLogPath[];
}

type SvnLogCopyFrom = {
  revision: string;
  path: string;
};

type SvnLogPathKind = 'dir'     /// directory
                    | 'file';   /// file

type SvnLogPathAction = 'A'     /// added 
                      | 'D'     /// deleted
                      | 'R'     /// replaced
                      | 'M';    /// modified

type SvnLogPath = {
  isPropertyModified: boolean;
  isTextModified: boolean;
  kind: SvnLogPathKind;
  action: SvnLogPathAction;
  copyFrom?: {
    path: string;
    revision: string;
  }
  path: string;
}

/** svn log --xml の出力をJSONに変換する */
export function jsonifyLog( log: string ) {
  const jsdom = new JSDOM();
  const parser = new jsdom.window.DOMParser();
  const doc = parser.parseFromString( log, 'application/xhtml+xml' );
  
  const logEntries = doc.querySelectorAll( 'logentry' );
  const res: SvnLogEntry[] = [];
  
  for( let i=0; i<logEntries.length; i++ ) {
    res.push( jsonifyLogEntry( logEntries.item(i) ) );
  }

  return res;
}

/** svn log --xml の1リビジョン分のログをJSONに変換する。
 * @param entryElement \<logentry\>要素
 */
function jsonifyLogEntry( entryElement: Element ) {
  const json: SvnLogEntry = {
    revision: entryElement.getAttribute( 'revision' ),
    author: entryElement.querySelector( 'author' ).innerHTML,
    date: new Date( entryElement.querySelector( 'date' ).innerHTML ),
    message: entryElement.querySelector( 'msg' ).innerHTML,
    paths: []
  };

  const pathElements = entryElement.querySelectorAll( 'path' );
  for( let i=0; i < pathElements.length; i++ ) {
    json.paths.push( jsonifyLogPath( pathElements.item( i ) ) );
  }

  return json;
}

/** svn log --xml の1リビジョンに含まれる \<path\>要素をJSONに変換する。
 * @param path \<path\>要素
 */
function jsonifyLogPath( path: Element ) {
  const json: SvnLogPath = {
    path: path.innerHTML,
    kind: path.getAttribute( 'kind' ) as SvnLogPathKind,              // no check
    isTextModified: Boolean( path.getAttribute( 'text-mods' ) ),
    isPropertyModified: Boolean( path.getAttribute( 'prop-mods' ) ),
    action: path.getAttribute( 'action' ) as SvnLogPathAction         // no check
  };

  // branch info
  let copyFrom: SvnLogCopyFrom;
  if( path.hasAttribute( 'copyfrom-path' ) ) {
    copyFrom = {
      revision: path.getAttribute( 'copyfrom-rev' ),
      path: path.getAttribute( 'copyfrom-path' ),
    };

    json.copyFrom = copyFrom;
  }

  return json;
}
