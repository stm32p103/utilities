# scanDir
指定したパスを起点として、再帰的にファイル・フォルダを走査し、得られたパスの配列を返す。
特定のパスのみ取得する場合は、`select`引数で与える関数で選択する。

```ts
import * as Path from 'path';

async function sample() {
  // 全てのファイル・フォルダのパス
  let allPaths = await scanDir( '/path/to/scan' );

  // ディレクトリのみ
  let directries = await scanDir( '/path/to/scan', ( dirent, path ) => dirent.isDirectory() );

  // 拡張子が .txt のファイルのみ
  let textFiles = await scanDir( '/path/to/scan', ( dirent, path ) => {
    const ext = Path.parse( path ).ext;
    return ext == '.txt';
  } );
}
```
