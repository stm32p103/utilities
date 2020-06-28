import { RestAPI } from '../../rest-api'
import { CREDENTIAL, HOST, PROJECTKEY } from '../../../test/sample';
import { ComponentEP, CreateComponentArg, UpdateComponentArg } from './component';
import { ProjectEP } from '../project';

const api = new RestAPI( new URL( HOST ) );
api.configureAuth( CREDENTIAL );
const componentEP = new ComponentEP( api );
const projectEP = new ProjectEP( api );

let createArg: CreateComponentArg = {
  project: PROJECTKEY,
  name: 'Jest Test Component',
  description: 'Jest Test Description',
  assigneeType: "PROJECT_LEAD",
  leadUserName: CREDENTIAL.username
};

let updateArg: UpdateComponentArg = {
  name: 'Jest Test Component Updated',
  description: 'Jest Test Description Updated',
  assigneeType: 'UNASSIGNED',
  lead: { name: '' }    // unassign
};

let id: string;

test('init', async () => {
  const project = await projectEP.get( PROJECTKEY );
  console.log( `Project Key: ${createArg.project}` );
  expect( project.key ).toBe( PROJECTKEY );
} );

test('create', async () => {
  const cmp = await componentEP.create( createArg );
  id = cmp.id;
  // console.log( cmp );
  expect( cmp.name ).toMatch( createArg.name );
  expect( cmp.project ).toBe( createArg.project );
  expect( cmp.lead.name ).toBe( createArg.leadUserName );
  expect( cmp.description ).toMatch( createArg.description );
  expect( cmp.assigneeType ).toMatch( createArg.assigneeType );
} );

test('get', async () => {
  const cmp = await componentEP.get( id );
  // console.log( cmp );
  expect( cmp.name ).toBe( createArg.name );
  expect( cmp.project ).toBe( createArg.project );
  expect( cmp.lead.name ).toBe( createArg.leadUserName );
  expect( cmp.description ).toBe( createArg.description );
  expect( cmp.assigneeType ).toBe( createArg.assigneeType );
} );

test('update', async () => {
  const cmp = await componentEP.update( id, updateArg );
  // console.log( cmp );
  expect( cmp.name ).toBe( updateArg.name );
  expect( cmp.lead ).toBe( undefined );
  expect( cmp.description ).toBe( updateArg.description );
  expect( cmp.assigneeType ).toBe( updateArg.assigneeType );
} );

test('issue count', async () => {
  const counts = await componentEP.getRelatedIssueCounts( id );
  // console.log( cmp );
  expect( counts ).toHaveProperty( 'issueCount' );
} );

test('remove', async () => {
  await componentEP.delete( id );
  try {
    await componentEP.get( id );
  } catch (e) {
    expect(e.response.status).toBe(404);
  }
} );
