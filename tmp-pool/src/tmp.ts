import { file, dir, DirOptions, FileOptions } from 'tmp';

type TmpDir = {
  path: string;
  remove: () => void;
}

type TmpFile = {
  path: string;
  descriptor: number;
  remove: () => void;
}

function createTmpDir( option: DirOptions ) {
  return new Promise<TmpDir>( ( resolve, reject ) => {
    dir( option, ( err, path: string, remove: () => void ) => {
      if( !err ) {
        resolve( { path: path, remove: remove } );
      } else {
        reject( err );
      }
    } )
  } );
}

function createTmpFile( option: FileOptions ) {
  return new Promise<TmpFile>( ( resolve, reject ) => {
    file( option, ( err, path: string, fd: number, remove: ()=>void ) => {
      if( !err ) {
        resolve( { path: path, descriptor: fd, remove: remove } );
      } else {
        reject( err );
      }
    } )  
  } );
}

export type TmpPoolOption = Omit<FileOptions,'detachDescriptor' | 'discardDescriptor'>;

export class TmpPool {
  private idle: TmpFile[] = [];
  private busy: TmpFile[] = [];
  private option: FileOptions;
  constructor( option: TmpPoolOption = {} ) {
    this.option = Object.assign( {}, option );
    this.option.detachDescriptor = true;
    this.option.discardDescriptor = true;
  }

  /** Remove currently unused temporary files. */
  removeUnused() {
    this.idle.forEach( file => file.remove() );
    this.idle = [];
  }

  /** Remove all temporary files regardless being used or not. */
  removeAll() {
    this.removeUnused();
    this.busy.forEach( file => file.remove() );
    this.busy = [];
  }

  async allocate( count: number ) {
    const files = await Promise.all( new Array( count ).map( () => createTmpFile( this.option ) ) );
    this.idle.push( ...files );
  }

  async allocateMinimum( minCount: number ) {
    const diff = this.idle.length + this.busy.length - minCount;
    if( diff > 0 ) {
      await this.allocate( diff );
    }
  }

  /**
   * Acquire a path of temporary file.
   * If no free temporary file exists, create and return its path.
   * Otherwise return existing path. */
  async acquire() {
    let file = this.idle.pop();
    if( !file ) {
      file = await createTmpFile( this.option );
    }

    this.busy.push( file );
    return file.path;
  }

  /**
   * @param path Path of the temporary file to release.
   * @returns Remaining number of free temporary files.
   */
  release( path: string ) {
    const index = this.busy.findIndex( file => path == file.path );
    if( index >= 0 ) {
      const released = this.busy[ index ];
      this.busy.splice( index, 1 );
      this.idle.push( released );  
    }
    return this.idle.length;
  }
}
