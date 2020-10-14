# BasicAuthRestApi
Basic認証を使ったREST APIへのアクセス用の簡単なインターフェース。

```
const api = new BasicAuthRestApi( new URL( 'http://google.com' ) );
const res = api.get( '' ).then( res => {
  console.log( res );
} );
```