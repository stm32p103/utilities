import { RestAPI } from '../../rest-api'
import { CREDENTIAL, HOST } from '../../../test/sample'
import { Jira } from '..';
import { CreateProjectArg, UpdateProjectArg } from './project';

const api = new RestAPI( new URL( HOST ) );
api.configureAuth( CREDENTIAL );

const jira = new Jira( api );

let projectId: string = '';
const createArg: CreateProjectArg = {
  key: 'UTC',
  lead: 'jadmin',
  projectTypeKey: 'software',
  assigneeType: 'UNASSIGNED',
  name: 'New Project',
  description: 'New Project Description'
};

const updateArg: UpdateProjectArg = {
  key: 'UTU',
  lead: 'jirauser',
  assigneeType: 'PROJECT_LEAD',
  name: 'New Project Updated',
  description: 'New Project Description Updated'
};


test('create', async () => {
  const project = await jira.project.create( createArg );
  projectId = String( project.id );
  console.log( project );  
  expect( project.key ).toBe( createArg.key );
} );

test('get', async () => {
  const project = await jira.project.get( projectId );
  // console.log( category );
  expect( project.id ).toBe( projectId );
  expect( project.key ).toBe( project.key );
  expect( project.name ).toBe( project.name );
  expect( project.description ).toBe( project.description );
} );

test('update', async () => {
  const category = await jira.project.update( projectId, updateArg );
  // console.log( category );
  expect( category.id ).toBe( projectId );
  expect( category.name ).toBe( updateArg.name );
  expect( category.description ).toBe( updateArg.description );
} );

test('delete', async () => {
  await jira.project.delete( projectId );
  try {
    await jira.project.get( projectId );
  } catch (e) {
    expect(e.response.status).toBe(404);
  }
} );
