import { RestAPI } from '../../rest-api'
import { CREDENTIAL, HOST } from '../../../test/sample'
import { Jira } from '../';

const api = new RestAPI( new URL( HOST ) );
api.configureAuth( CREDENTIAL );

const jira = new Jira( api );

let typeKey: string;

test('get all', async () => {
  const types = await jira.projectType.getAll();
  typeKey = types[0].key;
  // console.log( types );
  expect( types.length ).toBeGreaterThan( 0 );
} );

test('get', async () => {
  const type = await jira.projectType.get( typeKey );
  // console.log( type );
  expect( type.key ).toBe( typeKey );
} );

test('get accessible', async () => {
  const type = await jira.projectType.getAccessible( typeKey );
  // console.log( type );
  expect( type.key ).toBe( typeKey );
} );
