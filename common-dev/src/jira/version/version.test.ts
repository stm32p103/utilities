import { RestAPI } from '../../rest-api'
import { getKeys } from '../common/types';
import { CREDENTIAL, HOST } from '../../../test/sample'
import { Jira } from '..';
import { Version, CreateVersionArg, UpdateVersionArg } from './version';

const api = new RestAPI( new URL( HOST ) );
api.configureAuth( CREDENTIAL );

const jira = new Jira( api );

let versionId: string = '';
const createArg: CreateVersionArg = {
  name: 'JEST VERSION',
  project: 'API',
  startDate: '2020-06-10',
  releaseDate: '2020-06-15',
  description: 'Description.'
};

const updateArg: UpdateVersionArg = {
  name: 'JEST VERSION2',
  startDate: '2020-05-10',
  releaseDate: '2020-07-15',
  description: 'Updated Description'
};

test('create', async () => {
  const version = await jira.version.create( createArg );
  versionId = String( version.id );
  console.log( version );
  expect( version.name ).toBe( createArg.name );
  expect( version.description ).toBe( createArg.description );
} );

test('get', async () => {
  const version = await jira.version.get( versionId, [ 'startDate' ] );
  console.log( version );

  expect( version.id ).toBe( versionId );
  expect( version.name ).toBe( createArg.name );
  expect( version.description ).toBe( createArg.description );
} );

test('update', async () => {
  const version = await jira.version.update( versionId, updateArg );
  console.log( version );

  expect( version.id ).toBe( versionId );
  expect( version.name ).toBe( updateArg.name );
  expect( version.description ).toBe( updateArg.description );
} );

test('delete', async () => {
  await jira.version.delete( versionId );
  try {
    await jira.version.get( versionId );
  } catch (e) {
    expect(e.response.status).toBe(404);
  }
} );
