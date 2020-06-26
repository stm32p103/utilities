import { Jira } from '../src/jira';
import { getKeys } from '../src/jira/common/types';
import { promises } from 'fs';

async function testUserAvatar( jira: Jira ) {
  const image = await promises.readFile( './src/credential/avatar.jpg' );
  console.log( '-----------------------------' );
  console.log( 'store' );
  let storeAvatar = await jira.user.storeTemporaryAvater( 'jirauser', { buffer: image, filename: 'avatar.jpg', mime: 'image/jpeg' } );
  let crop = {
    cropperOffsetX: 5,
    cropperOffsetY: 5,
    cropperWidth:   475,
    needsCropping:  true
  };
  console.log( getKeys( storeAvatar ) );

  console.log( '-----------------------------' );
  console.log( 'create' );
  let createAvatar = await jira.user.createAvatarFromTemporary( 'jirauser', crop );
  console.log( getKeys( createAvatar ) );
  console.log( createAvatar );

  console.log( '-----------------------------' );
  console.log( 'update' );
  await jira.user.updateAvatar( 'jirauser', createAvatar );

  console.log( '-----------------------------' );
  console.log( 'get' );
  let getAvatars = await jira.user.getAllAvatars( 'jirauser' );
  console.log( getKeys( getAvatars.custom[0] ) );
  console.log( getKeys( getAvatars.system[0] ) );
  console.log( getAvatars );

  console.log( '-----------------------------' );
  console.log( 'delete' );
  await jira.user.deleteAvatar( 'jirauser', getAvatars.custom[0].id );
}

async function deleteUserAvatars( jira: Jira ) {
  console.log( '-----------------------------' );
  console.log( 'get' );
  let avatars = await jira.user.getAllAvatars( 'jirauser' );
  await Promise.all( avatars.custom.map( avatar => jira.user.deleteAvatar( 'jirauser', avatar.id ) ) );
  console.log( 'deleted');
}
