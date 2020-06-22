import { RestAPI } from './rest-api';
import { Jira } from './jira';
import { CREDENTIAL } from './credential';
import { promises } from 'fs';

async function test() {
  const api = new RestAPI( new URL( 'http://localhost:8080' ) );
  api.configureAuth( CREDENTIAL );

  const jira = new Jira( api );
  const image = await promises.readFile( './src/credential/avatar.jpg' );

  try {
    // const avatar1 = await jira.userAvatar.storeTemporaryAvater( 'jadmin', image );
    // console.log( avatar1 );
    // const avatar2 = await jira.userAvatar.createFromTemporary( 'jadmin', { cropperOffsetX: 0, cropperOffsetY: 0, cropperWidth: 1536, needsCropping: true }, avatar1.cookie );
    // console.log( avatar2 );
 
    // let createIssue = await jira.issue.create( { key: 'SAMPLES' }, { issuetype: { name: '新機能' }, summary: 'hello' } );
    // console.log( createIssue.data );

    // let addAttachment = await jira.issue.addAttachment( 'SAMPLES-1', 'sample.jpg', image );
    // console.log( addAttachment );

    let issue = await jira.issue.get( 'SAMPLES-1' );
    let attachmentIds: string[] = issue.data.fields.attachment.map( attachment => attachment.id as string );
    console.log( attachmentIds );

    const meta = await jira.attachment.getMeta();
    console.log( meta.data );

    let user = await jira.user.findAssignable( { project: 'SAMPLES' } );
    console.log( user );

    let storeAvatar = await jira.userAvatar.storeTemporaryAvater( 'jirauser', image );
    let crop = {
      cropperOffsetX: 10,
      cropperOffsetY: 10,
      cropperWidth:   400,
      needsCropping:  true
    };
    console.log( storeAvatar.data );

    let createAvatar = await jira.userAvatar.createFromTemporary( 'jirauser', crop, storeAvatar.cookies );
    console.log( createAvatar.data );

    let updateAvatar = await jira.userAvatar.update( 'jirauser', createAvatar.data, storeAvatar.cookies );
    console.log( updateAvatar.data );

  } catch( err ) {
    if( err.response ) {
      console.log( err.response.status );
      console.log( err.response.data );
    }
  }
}

test();