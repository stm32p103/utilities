import { RestAPI } from '../../rest-api'
import { CREDENTIAL, HOST, PROJECTKEYS } from '../../../test/sample'
import { Jira } from '../';
import { getKeys } from '../common/types';

const api = new RestAPI( new URL( HOST ) );
api.configureAuth( CREDENTIAL );

const jira = new Jira( api );

let userId: string;

test('get', async () => {
  const user = await jira.user.get( { username: CREDENTIAL.username } );
  console.log( getKeys( user ) );
  console.log( user );
  expect( user.name ).toBe( CREDENTIAL.username );
} );

test('find bulk assignable users', async () => {
  const users = await jira.user.findBulkAssignable( { projectKeys: PROJECTKEYS } );
  console.log( getKeys( users[0] ) );
} );

test('find assignable users', async () => {
  const users = await jira.user.findAssignable( { project: 'API' } );
  console.log( getKeys( users[0] ) );
} );

test('find user with all permissions', async () => {
  const users = await jira.user.findUsersWithAllPermissions( { permissions: [ 'CLOSE_ISSUE' ], issueKey: 'SMP-1' } );
  console.log( getKeys( users[0] ) );  
} );

test('find user for picker', async () => {
  const users = await jira.user.findUsersForPicker( { query: 'adm', showAvatar: true } );
  console.log( users );  
} );

test('find user', async () => {
  const users = await jira.user.findUsers( { username: 'adm' } );
  console.log( users[0] ); 
} );

test('find user with browse permission', async () => {
  const users = await jira.user.findUsersWithBrowsePermission( { username: 'adm', issueKey: 'API-1' } );
  console.log( users[0] ); 
} );
