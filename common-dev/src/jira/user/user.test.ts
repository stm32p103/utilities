import { RestAPI } from '../../rest-api'
import { CREDENTIAL, HOST, PROJECTKEYS } from '../../../test/sample'
import { Jira } from '../';
import { getKeys } from '../common/types';

const api = new RestAPI( new URL( HOST ) );
api.configureAuth( CREDENTIAL );

const jira = new Jira( api );
const keyword = CREDENTIAL.username.substr(0,3);
let userKey: string;

function checkKeyExists( key: string, users: { key: string }[] ) {
  const index = users.findIndex( u => u.key == userKey );
  expect( index ).toBeGreaterThanOrEqual(0);
}

test('get', async () => {
  const user = await jira.user.get( { username: CREDENTIAL.username } );
  userKey = user.key;
  // console.log( getKeys( users[0] ) );
  // console.log( user );
  expect( user.name ).toBe( CREDENTIAL.username );
} );

test('find bulk assignable users', async () => {
  const users = await jira.user.findBulkAssignable( { projectKeys: PROJECTKEYS } );
  // console.log( getKeys( users[0] ) );
  checkKeyExists( userKey, users );
} );

test('find assignable users', async () => {
  const users = await jira.user.findAssignable( { project: PROJECTKEYS[0] } );
  // console.log( users[0] );
  checkKeyExists( userKey, users );
} );

test('find user with all permissions', async () => {
  const users = await jira.user.findUsersWithAllPermissions( { permissions: [ 'CLOSE_ISSUE' ], issueKey: `${PROJECTKEYS[0]}-1` } );
  // console.log( users[0] );
  checkKeyExists( userKey, users );
} );

test('find user for picker', async () => {
  const picker = await jira.user.findUsersForPicker( { query: keyword, showAvatar: true } );
  // console.log( picker );
  checkKeyExists( userKey, picker.users );
} );

test('find user', async () => {
  const users = await jira.user.findUsers( { username: keyword } );
  // console.log( users[0] );
  checkKeyExists( userKey, users );
} );

test('find user with browse permission', async () => {
  const users = await jira.user.findUsersWithBrowsePermission( { username: keyword, issueKey: 'API-1' } );
  // console.log( users[0] );
  checkKeyExists( userKey, users );
} );
