import { RestAPI } from '../../rest-api'
import { CREDENTIAL, HOST, FILENAME, ISSUEKEY } from '../../../test/sample'
import { AttachmentEP } from './attachment';
import { IssueEP } from '../issue';
import { promises } from 'fs';

const api = new RestAPI( new URL( HOST ) );
const attachmentEP = new AttachmentEP( api );

// for 
const issueEP = new IssueEP( api );
api.configureAuth( CREDENTIAL );

let id: string;

test('init', async () => {
  const buffer = await promises.readFile( 'test/sample/avatar.jpg' );
  const attachments = await issueEP.addAttachment( ISSUEKEY, FILENAME, buffer );
  id = attachments[0].id;
  console.log( `Attachment ID: ${id}` );
  expect( attachments[0].filename ).toBe( FILENAME );
  expect( attachments[0].author.name ).toBe( CREDENTIAL.username );
  console.log( attachments[0] );
} );

test('get', async () => {
  const get = await attachmentEP.get( id );
  console.log( get );
  expect( get?.self ).toMatch( RegExp( id ) );
} );

test('meta', async () => {
  const meta = await attachmentEP.getMeta();
  console.log( meta );
  expect( meta ).toHaveProperty( 'enabled' );
  expect( meta ).toHaveProperty( 'uploadLimit' );
} );

test('remove', async () => {
  await attachmentEP.remove( id );
  try {
    await attachmentEP.get( id );
  } catch (e) {
    expect(e.response.status).toBe(404);
  }
} );
