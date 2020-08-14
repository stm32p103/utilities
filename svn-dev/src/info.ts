import { JSDOM } from 'jsdom';
import { SvnLogPathKind } from './types';
import { getInnerHtml } from './util';

type SvnCommitInfo = {
  revision: number;
  author: string;
  date: Date;
}

type SvnRepositoryInfo = {
  root: string;
  uuid: string;
}

// only for working-copy
type SvnWorkingCopyInfo = {
  root: string;
  schedule: string;
  depth: string;
}

type SvnInfoEntry = {
  kind: SvnLogPathKind;
  path: string;
  revision: number;
  url: {
    absolute: string;
    relative: string;
  },
  commit: SvnCommitInfo;
  repository: {
    root: string;
    uuid: string;
  },
  // only for working-copy
  workingCopyInfo?: {
    root: string;
    schedule: string;
    depth: string;
  }
}

/** svn info --xml の出力をJSONに変換する */
export function getInfo( log: string ) {
  const jsdom = new JSDOM();
  const parser = new jsdom.window.DOMParser();
  const doc = parser.parseFromString( log, 'application/xhtml+xml' );
  
  const entries = doc.querySelectorAll( 'entry' );
  const res: SvnInfoEntry[] = [];
  
  for( let i = 0; i < entries.length; i++ ) {
    res.push( getInfoEntry( entries.item(i) ) );
  }

  return res;
}

function getInfoEntry( element: Element ) {
  const json: SvnInfoEntry = {
    kind: element.getAttribute( 'kind' ) as SvnLogPathKind,
    path: element.getAttribute( 'path' ),
    revision: Number( element.getAttribute( 'revision' ) ),
    url: {
      absolute: getInnerHtml( element, 'url' ),
      relative: getInnerHtml( element, 'relative-url' ),
    },
    commit: getCommit( element.querySelector( 'commit' ) ),
    repository: getRepository( element.querySelector( 'repository' ) ),
    workingCopyInfo: getWorkingCopyInfo( element.querySelector( 'wc-info' ) )
  };

  return json;
}

function getCommit( element: Element ) {
  const json: SvnCommitInfo = {
    revision: Number( element.getAttribute( 'revision' ) ),
    author: getInnerHtml( element, 'author' ),
    date: new Date( getInnerHtml( element, 'date' ) ),
  }
  return json;
}

function getRepository( element: Element ) {
  const json: SvnRepositoryInfo = {
    root: getInnerHtml( element, 'root' ),
    uuid: getInnerHtml( element, 'uuid' )
  }
  return json;
}

function getWorkingCopyInfo( element: Element ) {
  if( element == null ) return;

  const json: SvnWorkingCopyInfo = {
    root: getInnerHtml( element, 'wcroot-abspath' ),
    schedule: getInnerHtml( element, 'schedule' ),
    depth: getInnerHtml( element, 'depth' )
  }
  return json;
}
