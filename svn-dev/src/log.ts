import { JSDOM } from 'jsdom';

type SvnLogEntry = {
  revision: string;
  author: string;
  date: Date;
  message: string;
  paths: SvnLogPath[];
}

type SvnLogPathKind = 'dir'     // directory
                    | 'file';   // file

type SvnLogPathAction = 'A'     // added 
                      | 'D'     // deleted
                      | 'R'     // replaced
                      | 'M';    // modified

type SvnLogCopyFrom = {
  revision: string;
  path: string;
};
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


export function parseLogXml( doc: Document ) {
  const logEntries = doc.querySelectorAll( 'logentry' );
  const a = logEntries.item(0);
}

export function jsonifyLogEntry( entryElement: Element ) {
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

export function jsonifyLogPath( path: Element ) {
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
