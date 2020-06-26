import { Jira } from '../src/jira';
import { getKeys } from '../src/jira/common/types';

async function testProjectType( jira: Jira ) {
  console.log( '-----------------------------' );
  console.log( 'getAll' );
  const allTypes = await jira.projectType.getAll();
  console.log( getKeys( allTypes[0] ) );

  console.log( '-----------------------------' );
  console.log( 'get' );
  const getByType = await jira.projectType.get( 'business' );
  console.log( getKeys( getByType ) );

  console.log( '-----------------------------' );
  const accessible = await jira.projectType.getAccessible( 'software' );
  console.log( 'getAccessible' );
  console.log( getKeys( accessible ) );
}

