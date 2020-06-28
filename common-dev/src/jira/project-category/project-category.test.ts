import { RestAPI } from '../../rest-api'
import { CREDENTIAL, HOST } from '../../../test/sample'
import { Jira } from '..';
import { CreateProjectCategoryRequiredArg, UpdateProjectCategoryRequiredArg } from './project-category';

const api = new RestAPI( new URL( HOST ) );
api.configureAuth( CREDENTIAL );

const jira = new Jira( api );

let categoryId: string;
const createArg: CreateProjectCategoryRequiredArg = {
  name: 'New Project Category',
  description: 'New Project Category Description'
};

const updateArg: UpdateProjectCategoryRequiredArg = {
  name: 'New Project Category Updated',
  description: 'New Project Category Description Updated'
};


test('create', async () => {
  const category = await jira.projectCategory.create( createArg );
  categoryId = category.id;
  // console.log( category );
  expect( category.name ).toBe( createArg.name );
  expect( category.description ).toBe( createArg.description );
} );

test('get', async () => {
  const category = await jira.projectCategory.get( categoryId );
  // console.log( category );
  expect( category.id ).toBe( categoryId );
  expect( category.name ).toBe( createArg.name );
  expect( category.description ).toBe( createArg.description );
} );

test('update', async () => {
  const category = await jira.projectCategory.update( categoryId, updateArg );
  // console.log( category );
  expect( category.id ).toBe( categoryId );
  expect( category.name ).toBe( updateArg.name );
  expect( category.description ).toBe( updateArg.description );
} );

test('delete', async () => {
  await jira.projectCategory.delete( categoryId );
  try {
    await jira.projectCategory.get( categoryId );
  } catch (e) {
    expect(e.response.status).toBe(404);
  }
} );
