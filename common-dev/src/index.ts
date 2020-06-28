import { RestAPI } from './rest-api';
import { Jira } from './jira';
import { getKeys } from './jira/common/types';
import { CREDENTIAL } from './credential';
import { promises } from 'fs';

const api = new RestAPI( new URL( 'http://localhost:8080' ) );
api.configureAuth( CREDENTIAL );
const jira = new Jira( api );

async function test() {
  try {
    console.log( '-----------------------------' );
    console.log( 'delete all' );
    const versions = await jira.project.getVersions( 'API2' );
    await Promise.all( versions.map( version => jira.version.delete( version.id ) ) );
    // await jira.version.create( { project: 'API2', name: 'VERSIONs', expand: 'aa' } );
    console.log( '-----------------------------' );
    console.log( 'create' );
    const created = await jira.version.create( { project: 'API2', name: 'Created aaa' } );
    console.log( getKeys( created ) );
    console.log( created );

    console.log( '-----------------------------' );
    console.log( 'get' );
    const version = await jira.version.get( created.id );
    console.log( getKeys( version ) );
    console.log( version );
      
    console.log( '-----------------------------' ); 
    console.log( 'update' );
    const update = await jira.version.update( created.id, { name: 'aa', startDate: '2020-06-05', archived: 'true', released: 'true' } );
    console.log( getKeys( update ) );
    console.log( update );

    console.log( '-----------------------------' );
    console.log( 'createOrUpdateRemoteVersionLink' );
    const link = await jira.version.createOrUpdateRemoteVersionLink( created.id );
    console.log( link );

    console.log( '-----------------------------' );
    console.log( 'getRemoteVersionLinks' );
    const links = await jira.version.getRemoteVersionLinks( created.id );
    console.log( links );

    console.log( '-----------------------------' );
    console.log( 'get' );
    const version2 = await jira.version.get( created.id, [ "remotelinks", "project" ] );
    console.log( getKeys( version2) );
    console.log( version2 );

    console.log( '-----------------------------' );
    console.log( 'delete' );
    const deleted = await jira.version.delete( created.id );
    console.log( deleted );


  } catch( err ) { 
    if( err.response ) {
      console.log( err.response.status );
      console.log( err.response.data );
    }
  }
}
test();


async function testComponent( projectId: string ) {
  const components = await jira.project.getComponents( projectId );  
  await Promise.all( components.map( c => jira.component.delete( c.id ) ) );
  
  const create = await jira.component.create( { 
    project: projectId,
    name: 'Test Component',
    lead: { name: 'jadmin' },
    description: 'Test Component Description.'
  } );
  console.log( create );
  console.log( '#########################################' );

  const get = await jira.component.get( create.id );
  console.log( get );

  const update = await jira.component.update( create.id, { lead: { name: 'jadmin' } } );
  console.log( update );
}

async function testProject( key: string, username: string ) {
    console.log( '-----------------------------' );
    console.log( 'getAll' );
    const projects = await jira.project.getAll();
    console.log( getKeys( projects[0] ) );
    console.log( projects[0].expand.split(',') );

    console.log( '-----------------------------' );
    console.log( 'create' );
    const created = await jira.project.create( { key: key, lead: username, name: 'New Project!!!', projectTypeKey: 'software' } );
    console.log( getKeys( created ) );

    console.log( '-----------------------------' );
    console.log( 'get' );
    const get = await jira.project.get( created.id  );
    console.log( getKeys( get ) );
    console.log( get.expand.split(',') );

    console.log( '-----------------------------' );
    console.log( 'update' );
    const update = await jira.project.update( created.id, {
      name: 'Updated Project!!!',
      lead: 'jadmin',
      assigneeType: 'PROJECT_LEAD',
      description: 'Updated description.',
      key: key + key
    } );
    console.log( update );
    console.log( getKeys( update ) );
    console.log( update.expand.split(',') );

    console.log( '-----------------------------' );
    console.log( 'versions' );
    const versions = await jira.project.getVersions( 'SMP' );
    console.log( versions );

    console.log( '-----------------------------' );
    console.log( 'delete' );
    await jira.project.delete( update.id );
    // const updated = await jira.project.update( project.id, { name: 'New Project2' } );
    // console.log( updated );

    // console.log( '-----------------------------' );
    // console.log( 'get' );

    // const project = await jira.project.get( 'SAMPLES' );
    // const dst = await jira.project.get( 'API' );
}

async function testSystemAvatar() {
}


async function projectCategory( jira: Jira ) {
  const categories = await jira.projectCategory.getAll();
  console.log( '-----------------------------' );
  console.log( getKeys( categories ) );
  console.log( categories );

  const category = await jira.projectCategory.get( categories[1].id );
  console.log( '-----------------------------' );
  console.log( getKeys( category ) );
  console.log( category );

  category.name = `projectCategory-${category.id}`;

  const updated = await jira.projectCategory.update( category );
  console.log( '-----------------------------' );
  console.log( getKeys( updated ) );
  console.log( updated );

  const newCategory = await jira.projectCategory.create( { name: 'New Sample Category', description: 'sample' } );
  console.log( '-----------------------------' );
  console.log( getKeys( newCategory ) );
  console.log( newCategory );

  await jira.projectCategory.delete( newCategory.id );
}
