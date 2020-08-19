import { Dirent, promises } from 'fs';
import { join } from 'path';

type syncSelectFunction = ( dirent: Dirent, parentPath: string ) => boolean;
type asyncSelectFunction = ( dirent: Dirent, parentPath: string ) => Promise<boolean>;

// 再帰的にフォルダを探索し、パスの配列を返す関数
export async function scanDir( root: string, select?: syncSelectFunction | asyncSelectFunction ) {
  const selectedPaths: string[] = [];   // 条件にマッチするパス

  // 子階層のファイルを探す関数
  const scanChildDir = async ( parentPath: string ) => {
    const dir = await promises.opendir( parentPath );
    const childPaths: string[] = [];

    // asyncIterator を使ったdirent(directory entry)のループ
    for await ( const dirent of dir ) {
      const childPath = join( dir.path, dirent.name );

      if( dirent.isDirectory() ) {
        // ディレクトリなら探索する対象に加える
        childPaths.push( childPath );
      }
    
      // 与えられた条件を満たすか判定する
      let selected = true;
      
      if( select ) {
        const tmp = select( dirent, dir.path );
        if( typeof tmp == 'boolean' ) {
          selected = tmp;
        } else {
          selected = await tmp;
        }
      }

      // 条件を満たしたらパスを追加
      if( selected ) {
        selectedPaths.push( childPath );
      }
    }
        
    // 子階層全てを走査する(再起呼び出し)
    return await Promise.all( childPaths.map( p => scanChildDir( p ) ) );
  }

  // rootを起点に走査する
  await scanChildDir( root );
  return selectedPaths;
}
