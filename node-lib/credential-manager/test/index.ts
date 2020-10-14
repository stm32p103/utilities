import { CredentialManager } from '../src';

const username = 'SampleUser';
const username2 = 'SampleUser2';

const password = 'SamplePassword';
const password2 = 'WrongPassword';

const manager = new CredentialManager( 'CredentialManagerTest' );

test('basic', async () => {
  await manager.deleteAll();

  const before = await manager.exists( username );
  expect( before ).toBeFalsy();

  await manager.save( username, password );

  const after = await manager.exists( username );
  expect( after ).toBeTruthy();

  const pass = await manager.getPassword( username );
  expect( pass ).toEqual( password );

  const users = await manager.getAllUsers();
  expect( users ).toEqual( expect.arrayContaining( [ username ] ) );

  const correct = await manager.check( username, password );
  expect( correct ).toBeTruthy();

  const wrong = await manager.check( username, password2 );
  expect( wrong ).toBeFalsy();
  
  await manager.save( username2, password2 );
  const users2 = await manager.getAllUsers();
  expect( users2 ).toEqual( expect.arrayContaining( [ username, username2 ] ) );

  await manager.deleteAll();
  const deleted = await manager.getAllUsers();
  expect( deleted ).toEqual( [] );
} );

test('reject invalid username, password', async () => {
  expect( async () => await manager.save( null, password ) ).rejects.toThrow();
  expect( async () => await manager.save( '', password ) ).rejects.toThrow();
  expect( async () => await manager.save( undefined, password ) ).rejects.toThrow();
  expect( async () => await manager.save( username, null ) ).rejects.toThrow();
  expect( async () => await manager.save( username, '' ) ).rejects.toThrow();
  expect( async () => await manager.save( username, undefined ) ).rejects.toThrow();
  
  await manager.deleteAll();
} );
