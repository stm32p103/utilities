import { RestAPI } from '../rest-api'
import { SelectProperty } from './common/types';

/**
 * Jira REST API: Project Category
 */
export interface ProjectCategory {
  description?: string;
  id?: string;
  name?: string;
  self?: string;
}

const CreateProjectCategoryRequiredArgKeys = [
  'name',
  'description'
] as const;
export type CreateProjectCategoryRequiredArg = SelectProperty<ProjectCategory, typeof CreateProjectCategoryRequiredArgKeys[number]>;

const UpdateProjectCategoryRequiredArgKeys = [
  'id',
] as const;
const UpdateProjectCategoryOptionalArgKeys = [
  'name',
  'description'
] as const;
export type UpdateProjectCategoryRequiredArg = SelectProperty<ProjectCategory, typeof UpdateProjectCategoryRequiredArgKeys[number], typeof UpdateProjectCategoryOptionalArgKeys[number]>;

const ProjectCategoryResponseKeys = [ 'self', 'id', 'description', 'name' ] as const;
export type ProjectCategoryResponse = SelectProperty<ProjectCategory, typeof ProjectCategoryResponseKeys[number]>;

/**
 * api/2/projectCategory Endpoint
 */
export class ProjectCategoryEP {
  constructor( private api: RestAPI ) {}

  /**
   * Get all project categories
   * 
   * GET /rest/api/2/projectCategory
   * @returns All project categories.
   */
  async getAll() {
    const path = `/rest/api/2/projectCategory`;
    const res = await this.api.get( path );
    return res as ProjectCategoryResponse[];
  }
  
  /**
   * Create project category
   * 
   * POST /rest/api/2/projectCategory
   * @param projectCategory Fields to create project category.
   * @returns Created project category.
   */
  async create( projectCategory: CreateProjectCategoryRequiredArg ) {
    const path = `/rest/api/2/projectCategory`;
    const res = await this.api.post( path, projectCategory );
    return res as ProjectCategoryResponse;
  }

  /**
   * Get project category by id
   * 
   * GET /rest/api/2/projectCategory/{id}
   * @param id Project category id.
   * @returns Project category.
   */
  async get( id: string ) {
    const path = `/rest/api/2/projectCategory/${id}`;
    const res = await this.api.get( path );
    return res as ProjectCategoryResponse;
  }
  
  /**
   * Remove project category
   * 
   * DELETE /rest/api/2/projectCategory/{id}
   * @param id Project category id.
   */
  async delete( id: string ) {
    const path = `/rest/api/2/projectCategory/${id}`;
    await this.api.delete( path );
  }

  /**
   * Update project category
   * PUT /rest/api/2/projectCategory/{id}
   * @param projectCategory Fields to update project category.
   */
  async update( projectCategory: UpdateProjectCategoryRequiredArg ) {
    const path = `/rest/api/2/projectCategory/${projectCategory.id}`;
    const res = await this.api.put( path, projectCategory );
    return res as ProjectCategoryResponse;
  }
}
