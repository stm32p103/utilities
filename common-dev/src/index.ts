import { RestAPI } from './rest-api';
import { Jira } from './jira';
import { CREDENTIAL } from './credential';
import { promises } from 'fs';

const api = new RestAPI( new URL( 'http://localhost:8080' ) );
api.configureAuth( CREDENTIAL );
const jira = new Jira( api );

async function avatar() {
  const image = await promises.readFile( './src/credential/avatar.jpg' );
  console.log( '-----------------------------' );
  console.log( 'store' );
  let storeAvatar = await jira.userAvatar.storeTemporaryAvater( 'jirauser', { buffer: image, filename: 'avatar.jpg', mime: 'image/jpeg' } );
  let crop = {
    cropperOffsetX: 5,
    cropperOffsetY: 5,
    cropperWidth:   475,
    needsCropping:  true
  };
  console.log( storeAvatar );

  console.log( '-----------------------------' );
  console.log( 'create' );
  let createAvatar = await jira.userAvatar.createFromTemporary( 'jirauser', crop );
  console.log( createAvatar );

  console.log( '-----------------------------' );
  console.log( 'update' );
  await jira.userAvatar.update( 'jirauser', createAvatar );

  console.log( '-----------------------------' );
  console.log( 'get' );
  let getAvatars = await jira.userAvatar.get( 'jirauser' );
  console.log( getAvatars.custom );

  console.log( '-----------------------------' );
  console.log( 'delete' );
  await jira.userAvatar.delete( 'jirauser', getAvatars.custom[0].id );
}

async function deleteAvatars() {
  console.log( '-----------------------------' );
  console.log( 'get' );
  let avatars = await jira.userAvatar.get( 'jirauser' );
  await Promise.all( avatars.custom.map( avatar => jira.userAvatar.delete( 'jirauser', avatar.id ) ) )
  console.log( 'deleted');
}

async function projectCategory() {
  const categories = await jira.projectCategory.getAll();
  console.log( '-----------------------------' );
  console.log( categories );

  const category = await jira.projectCategory.get( categories[1].id );
  console.log( '-----------------------------' );
  console.log( category );

  category.name = `projectCategory-${category.id}`;

  const updated = await jira.projectCategory.update( category );
  console.log( '-----------------------------' );
  console.log( updated );

  const newCategory = await jira.projectCategory.create( { name: 'Sample Category', description: 'sample' } );
  console.log( '-----------------------------' );
  console.log( newCategory );

  await jira.projectCategory.delete( newCategory.id );
}

async function testProjectType() {
  console.log( '-----------------------------' );
  console.log( 'getAll' );
  const allTypes = await jira.projectType.getAll();
  console.log( allTypes );

  console.log( '-----------------------------' );
  console.log( 'get' );
  const getByType = await jira.projectType.get( 'business' );
  console.log( getByType );

  console.log( '-----------------------------' );
  const accessible = await jira.projectType.getAccessible( 'software' );
  console.log( 'getAccessible' );
  console.log( accessible );
}

async function test() {
  try {
    const component = await jira.project.getComponents('10000');
    console.log( component );
  } catch( err ) {
    if( err.response ) {
      console.log( err.response.status );
      console.log( err.response.data );
    }
  }
}
test();