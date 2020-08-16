# tmp-pool
複数の一時ファイルを保持しておき、使い回せるようにした`tmp`のラッパー。

# 使い方
以下サンプルのように、一時ファイルを確保・開放する。

```ts
import { TmpPool } from '@stm32p103/tmp-pool'
import * as fs from 'fs';

// プールの作成(オプションはtmpに準拠)
const prefix = 'sample';
const pool = new TmpPool( { prefix: prefix } );

function async sample() {
  // 一時ファイルを作成
  const path = await pool.acquire();

  // 一時ファイルへの読み書き
  fs.writeFileSync( path, sampleText, { encoding: 'utf16le' } );
  const readText = fs.readFileSync( path, { encoding: 'utf16le' } );

  // 一時ファイルの開放(削除はせず、そのまま残す)
  // 戻り値は作成済みでそのまま使える一時ファイル数
  const remaining = pool.release( path );

  // releaseしていない一時ファイルを削除する
  pool.removeUnused();

  // 全一時ファイルを削除する
  // (プロセス終了時にコールすると良い)
  pool.removeAll();
}
```
