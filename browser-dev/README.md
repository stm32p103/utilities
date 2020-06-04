## table2array
`HTMLTableElement`を配列に変換する。`Rowspan`, `Colspan`がある場合、空き領域には `null` を埋める。

```typescript
const array = table2column(table);
```