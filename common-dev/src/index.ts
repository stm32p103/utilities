import { RestAPI } from './rest-api';
import { Jira } from './jira';
import { CREDENTIAL } from './credential';
import { promises } from 'fs';

const api = new RestAPI( new URL( 'http://localhost:8080' ) );
api.configureAuth( CREDENTIAL );
const jira = new Jira( api );

async function test() {
  try {
    const project = await jira.project.get( 'API2' );
    const projects = (await jira.project.getAll()).map( p => p.id );
    console.log( projects );
    // const update = await jira.project.update( project.id, {
    //   lead: 'jirauser'
    // } );
    // const statuses = await jira.project.statuses( project.id );
    // console.log( statuses );
    // const updateProjectType = await jira.project.updateProjectType( project.id, 'business' );
    // console.log( updateProjectType );
    // const versions = await jira.project.getVersionsPagenated( project.id, { orderBy: "name" } );
    // console.log( versions );
    await testComponent(project.key);
  } catch( err ) {
    if( err.response ) {
      console.log( err.response.status );
      console.log( err.response.data );
    }
  }
}
test();

function getKeys( obj: { [key: string]: any } ) {
  const arr: string[] = [];
  for( let key in obj ) {
    arr.push( key );
  }
  return arr;
}

async function testComponent( projectId: string ) {
  const components = await jira.project.getComponents( projectId );  
  await Promise.all( components.map( c => jira.component.delete( c.id ) ) );
  
  const create = await jira.component.create( { 
    project: projectId,
    name: 'Test Component',
    lead: { name: 'jadmin', active: true },
    description: 'Test Component Description.',
    realAssigneeType: "UNASSIGNED"
  } );
  console.log( create );
  console.log( '#########################################' );

  // const get = await jira.component.get( create.id );
  // console.log( get );

  const update = await jira.component.update( create.id, { lead: { name: 'jadmin' } } );
  console.log( update );

}














async function project() {
    // console.log( created );
    // console.log( '-----------------------------' );
    // console.log( 'getAll' );
    // const projects = await jira.project.getAll( [ 'lead' ] );
    // console.log( projects );
    // console.log( projects[0].lead );
    // const project = projects[1];

    // const updated = await jira.project.update( project.id, { name: 'New Project2' } );
    // console.log( updated );

    // console.log( '-----------------------------' );
    // console.log( 'get' );

    const project = await jira.project.get( 'SAMPLES' );
    const dst = await jira.project.get( 'API' );
}


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
