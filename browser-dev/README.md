
# 使い方

## table2array
`HTMLTableElement`を配列に変換する。`Rowspan`, `Colspan`がある場合、空き領域は `null` で埋めらるので、空セルとは区別ができる。

```ts
const array = table2column( table );
```

## ObservableFileReader
File Reader APIの拡張。`FileReader`のイベントを`rxjs`の`Observable`で扱えるようにするラッパー。指定したファイルをテキストとして読み出す場合、以下のように`Observable`を組み合わせる。。

```ts
export function readAsText( file: File ) {
  const reader = new ObservableFileReader();
  const failed = merge( reader.onAbort, reader.onError ).pipe(flatMap( evt => throwError( `Cannot read file. ${file.name}.` ) ) );
  const data = reader.onLoad.pipe( map( evt => ( evt as any ).target.result as string ) );
      
  reader.readAsText( file );
  return merge( data, failed ).pipe( takeUntil( reader.onLoadEnd ) );
}
```

## readAsText
指定したファイルをテキストとして読み出す`Observable`。

```ts
async function read( file: File ) {
  const textObservable = readAsText( file );

  // Promiseで読み出す場合
  const result = await textObservable.toPromise();
}



