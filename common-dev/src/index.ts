import { RestAPI } from './rest-api';
import { Jira } from './jira';
import { CREDENTIAL } from './credential';
import { promises } from 'fs';

const api = new RestAPI( new URL( 'http://localhost:8080' ) );
api.configureAuth( CREDENTIAL );
const jira = new Jira( api );

async function avatar() {
  const image = await promises.readFile( './src/credential/avatar.jpg' );
  let storeAvatar = await jira.userAvatar.storeTemporaryAvater( 'jirauser', image );
  let crop = {
    cropperOffsetX: 5,
    cropperOffsetY: 5,
    cropperWidth:   475,
    needsCropping:  true
  };
  console.log( storeAvatar );

  let createAvatar = await jira.userAvatar.createFromTemporary( 'jirauser', crop );
  console.log( createAvatar );

  let updateAvatar = await jira.userAvatar.update( 'jirauser', createAvatar );
  console.log( updateAvatar );

  let getAvatars = await jira.userAvatar.get( 'jirauser' );
  console.log( getAvatars.custom );

  // await jira.userAvatar.delete( 'jirauser', getAvatars.custom[0].id );
}

async function test() {
  try {
  } catch( err ) {
    if( err.response ) {
      console.log( err.response.status );
      console.log( err.response.data );
    }
  }
}
test();