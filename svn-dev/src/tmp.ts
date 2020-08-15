import { file, dir, DirOptions, FileOptions } from 'tmp';
export { FileOptions };

type TmpDir = {
  path: string;
  remove: () => void;
}

type TmpFile = {
  path: string;
  descriptor: number;
  remove: () => void;
}

export function createTmpDir( option: DirOptions ) {
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

export function createTmpFile( option: FileOptions ) {
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

type TmpFileOption = Omit<FileOptions,'detachDescriptor' | 'discardDescriptor'>;

export class TmpFileManager {
  private free: TmpFile[] = [];
  private busy: TmpFile[] = [];
  private option: FileOptions;
  constructor( option: TmpFileOption = {} ) {
    this.option = Object.assign( {}, option );
    this.option.detachDescriptor = true;
  }

  removeUnused() {
    this.free.forEach( file => file.remove() );
    this.free = [];
  }

  async acquire() {
    let file = this.free.pop();
    if( !file ) {
      file = await createTmpFile( this.option );
    }

    this.busy.push( file );
    return file.path;
  }

  release( path: string ) {
    const index = this.busy.findIndex( file => path == file.path );
    if( index >= 0 ) {
      const freed = this.busy[ index ];
      this.busy.splice( index, 1 );
      this.free.push( freed );  
    }
  }
}
