# replaceString
`template`で与えた文字列内の`${variableName}`を、`kv`で与えたオブジェクトの`kv[variableName]`メンバで置換する。

```ts
import { replaceString } from 'replace-string';
const data = {
  name: 'A',
  height: '10',
  width: '20',
  length: '30'
}
let template = '${name}: ${height}x${width}x${length}';

const res = replaceString( template, data );
console.log( res ); // A: 10x20x30
```
