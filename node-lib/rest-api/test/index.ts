import { BasicAuthRestApi } from '../src';

test('example', async () => {
  // not a test.
  const api = new BasicAuthRestApi( new URL( 'http://google.com' ) );
  const res = await api.get( '' );
  console.log( res );
} );
