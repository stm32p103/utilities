import { JSDOM } from 'jsdom';
import { SvnLogPathKind, SvnLogPathAction } from './types';
import { getInnerHtml } from './util';

export type SvnLogEntry = {
  revision: number;
  author: string;
  date: Date;
  message: string;
  paths: SvnLogPath[];
}

type SvnLogCopyFrom = {
  revision: number;
  path: string;
};

type SvnLogPath = {
  isPropertyModified: boolean;
  isTextModified: boolean;
  kind: SvnLogPathKind;
  action: SvnLogPathAction;
  copyFrom?: SvnLogCopyFrom;
  path: string;
}

/** 
 * svn log --xml の出力をJSONに変換する 
 * @param log svn log --xml の結果 */
export function getLog( log: string ) {
  const jsdom = new JSDOM();
  const parser = new jsdom.window.DOMParser();
  const doc = parser.parseFromString( log, 'application/xhtml+xml' );
  
  const logEntries = doc.querySelectorAll( 'logentry' );
  const res: SvnLogEntry[] = [];
  
  for( let i=0; i<logEntries.length; i++ ) {
    res.push( getLogEntry( logEntries.item(i) ) );
  }

  return res;
}

/** svn log --xml の1リビジョン分のログをJSONに変換する。
 * @param element \<logentry\>要素
 */
function getLogEntry( element: Element ) {
  const json: SvnLogEntry = {
    revision: Number( element.getAttribute( 'revision' ) ),
    author: getInnerHtml( element, 'author' ),
    date: new Date( getInnerHtml( element, 'date' ) ),
    message: getInnerHtml( element, 'msg' ),
    paths: []
  };

  const pathElements = element.querySelectorAll( 'path' );
  for( let i=0; i < pathElements.length; i++ ) {
    json.paths.push( getLogPath( pathElements.item( i ) ) );
  }

  return json;
}

/** svn log --xml の1リビジョンに含まれる \<path\>要素をJSONに変換する。
 * @param element \<path\>要素
 */
function getLogPath( element: Element ) {
  let copyFrom: SvnLogCopyFrom;
  if( element.hasAttribute( 'copyfrom-path' ) ) {
    copyFrom = {
      revision: Number( element.getAttribute( 'copyfrom-rev' ) ),
      path: element.getAttribute( 'copyfrom-path' ),
    };
  }

  const json: SvnLogPath = {
    path: element.innerHTML,
    kind: element.getAttribute( 'kind' ) as SvnLogPathKind,              // no check
    isTextModified: Boolean( element.getAttribute( 'text-mods' ) ),
    isPropertyModified: Boolean( element.getAttribute( 'prop-mods' ) ),
    action: element.getAttribute( 'action' ) as SvnLogPathAction,        // no check
    copyFrom: copyFrom
  };

  return json;
}
