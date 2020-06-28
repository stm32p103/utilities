import { RestAPI } from '../rest-api'
import { User } from './user';
import { Expandable, RequiresKey, Replace, SelectProperty, PagenatedList } from './common/types';
import { AvatarUrls } from './avatar';
import { Component } from './component';
import { ProjectCategory } from './project-category';
import { Version } from './version';

export type ProjectAssigneeType = 'PROJECT_LEAD' | 'UNASSIGNED';
/**
 * Jira REST API: Project
 */
export interface Project {
  archived?:        boolean;
  assigneeType?:    ProjectAssigneeType;
  avatarUrls?:      AvatarUrls;
  components?:      Component[];
  description?:     string;
  email?:           string;
  expand?:          string;
  id?:              string;
  issueTypes?:      IssueType[];
  key?:             string;
  lead?:            User;
  name?:            string;
  projectCategory?: ProjectCategory;
  projectKeys?:     string[];
  projectTypeKey?:  string;
  roles?:           any // Roles;
  self?:            string;
  url?:             string;
  versions?:        Version[];
}

const CreateProjectRequiredArgKeys = [ 'projectTypeKey', 'key', 'lead', 'name' ] as const;
const CreateProjectOptionalArgKeys = [ 'assigneeType', 'description' ] as const;
export type CreateProjectArg = Replace<SelectProperty<Project, typeof CreateProjectRequiredArgKeys[number], typeof CreateProjectOptionalArgKeys[number]>, { lead: string }>;

const UpdateProjectRequiredArgKeys = [] as const;
const UpdateProjectOptionalArgKeys = [ 'key', 'lead', 'name', 'description', 'assigneeType' ] as const;
export type UpdateProjectArg = Replace<SelectProperty<Project, typeof UpdateProjectRequiredArgKeys[number], typeof UpdateProjectOptionalArgKeys[number]>, { lead: string }>;


const ExpandKeyKeys = [ 'description', 'lead', 'url', 'projectKeys' ] as const;
export type ExpandKey = typeof ExpandKeyKeys[number];

// Responses
const GetProjectResponseKeys = [
  'self',
  'id',           'key',
  'description',  'lead',
  'components',   'issueTypes',
  'assigneeType', 'versions',
  'name',         'roles',
  'avatarUrls',   'projectTypeKey',
  'archived'
] as const;
export type GetProjectResponse = Expandable<RequiresKey<Project, typeof GetProjectResponseKeys[number]>>;
export type UpdateProjectResponse = GetProjectResponse;

const CreateProjectResponseKeys = [ 'self', 'id', 'key' ] as const;
export type CreateProjectResponse = SelectProperty<Project, typeof CreateProjectResponseKeys[number]>;

const GetAllProjectResponseKeys = [
  'self',
  'id',
  'key',
  'name',
  'avatarUrls',
  'projectTypeKey'
] as const;
export type GetAllProjectResponse = Expandable<RequiresKey<Project, typeof GetAllProjectResponseKeys[number]>>[];

export interface VersionsQuery {
  startAt?: number;
  maxResults?: number;
  orderBy?: 'sequence' | 'name' | 'startDate' | 'releaseDate';
  expand?: string;
}

export class ProjectEP {
  constructor( private api: RestAPI ) {}
  /**
   * Create project
   * 
   * POST /rest/api/2/project
   * @param project Fields to create project.
   * @returns Created projects.
   * 
   * Note: To specify project leader. Assign user name to 'lead'.
   */
  async create( project: CreateProjectArg ) {
    const path = `/rest/api/2/project`;
    const res = await this.api.post( path, project );
    return res as CreateProjectResponse;
  }

  /**
   * Get all projects
   * 
   * GET /rest/api/2/project
   * @param expand Fields to retrieve.
   * @returns Retrieved projects.
   */
  async getAll( expand?: ExpandKey[] ) {
    const path = `/rest/api/2/project`;
    const res = await this.api.get( path, { query: { expand: expand } } );
    return res as GetAllProjectResponse;
  }

  /**
   * Get project
   * 
   * GET /rest/api/2/project/{projectIdOrKey}
   * @param idOrKey Project id or key.
   * @param expand Fields to retrieve.
   * @returns Retrieved project.
   */
  async get( idOrKey: string, expand?: ExpandKey[] ) {
    const path = `/rest/api/2/project/${idOrKey}`;
    const res = await this.api.get( path, { query: { expand: expand } } );
    return res as GetProjectResponse;
  }

  /**
   * Update project
   * 
   * PUT /rest/api/2/project/{projectIdOrKey}
   * @param idOrKey Project id or key.
   * @param project Fields to update.
   * @param expand Fields to retrieve.
   * @returns updated project.
   */
  async update( idOrKey: string, project: UpdateProjectArg, expand?: ExpandKey[] ) {
    const path = `/rest/api/2/project/${idOrKey}`;
    const res = await this.api.put( path, project, { query: { expand: expand } } );
    return res as UpdateProjectResponse;
  }

  /**
   * Delete project
   * 
   * DELETE /rest/api/2/project/{projectIdOrKey}
   * @param idOrKey Project id or key.
   */
  async delete( idOrKey: string ) {
    const path = `/rest/api/2/project/${idOrKey}`;
    await this.api.delete( path );
  }

  /**
   * Archive project
   * 
   * PUT /rest/api/2/project/{projectIdOrKey}/archive
   * 
   * Note: Requires Jira Data Center License.
   * @param idOrKey Project id or key.
   */
  async archive( idOrKey: string ) {
    const path = `/rest/api/2/project/${idOrKey}/archive`;
    await this.api.put( path );
  }

  /**
   * Get project components
   * 
   * GET /rest/api/2/project/{projectIdOrKey}/components
   * @param idOrKey Project id or key.
   */
  async getComponents( idOrKey: string ) {
    const path = `/rest/api/2/project/${idOrKey}/components`;
    const res = await this.api.get( path );
    return res as Component[];
  }

  /**
   * Restore project
   * 
   * PUT /rest/api/2/project/{projectIdOrKey}/restore
   * 
   * Note: Requires Jira Data Center License.
   * @param idOrKey Project id or key.
   */
  async restore( idOrKey: string ) {
    const path = `/rest/api/2/project/${idOrKey}/restore`;
    await this.api.put( path );
  }

  /**
   * Get all statuses
   * 
   * GET /rest/api/2/project/{projectIdOrKey}/statuses
   * @param idOrKey Project id or key.
   * @returns List of status.
   */
  async statuses( idOrKey: string ) {
    const path = `/rest/api/2/project/${idOrKey}/statuses`;
    const res = await this.api.get( path );
    return res;
  }

  /**
   * Update project type
   * 
   * PUT /rest/api/2/project/{projectIdOrKey}/type/{newProjectTypeKey}
   * @param idOrKey Project id or key.
   * @param projectTypeKey New project type key. ('business', 'software', etc.)
   */
  async updateProjectType( idOrKey: string, projectTypeKey: string ) {
    const path = `/rest/api/2/project/${idOrKey}/type/${projectTypeKey}`;
    const res = await this.api.put( path );
    return res as Project;
  }

  /**
   * Get project versions paginated
   * 
   * GET /rest/api/2/project/{projectIdOrKey}/version
   * @param idOrKey Project id or key.
   * @param query Search criteria, sort order etc.
   */
  async getVersionsPagenated( idOrKey: string, query?: VersionsQuery ) {
    const path = `/rest/api/2/project/${idOrKey}/version`;
    const res = await this.api.get( path, { query: query } );
    return res as PagenatedList<Version>;
  }

  /**
   * Get project versions
   * 
   * GET /rest/api/2/project/{projectIdOrKey}/versions
   * @param idOrKey Project id or key.
   * @param query Search criteria, sort order etc.
   */
  async getVersions( idOrKey: string, expand?: ExpandKey[] ) {
    const path = `/rest/api/2/project/${idOrKey}/versions`;
    const res = await this.api.get( path, { query: { expand: expand } } );
    return res as Version[];
  }
}
