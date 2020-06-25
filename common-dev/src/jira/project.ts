import { RestAPI } from '../rest-api'
import { User } from './user';
import { RequiresKey, SubKeyof, Replace, SelectProperty, PagenatedList } from './common/types';
import { AvatarUrls } from './avatar';
import { Component } from './component';
import { ConcreteProjectCategory } from './project-category';
import { Version } from './version';

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
  projectCategory?: ConcreteProjectCategory;
  projectKeys?:     string[];
  projectTypeKey?:  string;
  roles?:           any // Roles;
  self?:            string;
  url?:             string;
  versions?:        Version[];
}

/* */
const CreateProjectRequiredArgKeys = [ 'projectTypeKey', 'key', 'lead', 'name', 'description' ] as const;
const CreateProjectOptionalArgKeys = [ 'assigneeType' ] as const;
export type CreateProjectArg = Replace<SelectProperty<Project, typeof CreateProjectRequiredArgKeys[number], typeof CreateProjectOptionalArgKeys[number]>, { lead: string }>;

const UpdateProjectRequiredArgKeys = [] as const;
const UpdateProjectOptionalArgKeys = [ 'key', 'lead', 'name', 'description', 'assigneeType' ] as const;
export type UpdateProjectArg = Replace<SelectProperty<Project, typeof UpdateProjectRequiredArgKeys[number], typeof UpdateProjectOptionalArgKeys[number]>, { lead: string }>;

export type ProjectAssigneeType = 'PROJECT_LEAD' | 'UNASSIGNED';
export type ExpandKey = SubKeyof<Project, 'description' | 'lead' | 'url' | 'projectKeys'>;

// Responses
export type GetProjectResponse = RequiresKey<Project, 
    'id' 
  | 'key' 
  | 'description' 
  | 'lead' 
  | 'components' 
  | 'issueTypes' 
  | 'assigneeType' 
  | 'versions' 
  | 'name' 
  | 'roles' 
  | 'avatarUrls' 
  | 'projectTypeKey' 
  | 'archived'>;
export type UpdateProjectResponse = GetProjectResponse;
export type GetAllProjectResponse = RequiresKey<Project, 
    'id' 
  | 'key' 
  | 'name' 
  | 'avatarUrls' 
  | 'projectCategory'>;
export type CreateProjectResponse = Pick<Project, 'id' | 'key'>;

export interface VersionsQuery {
  startAt?: number;
  maxResults?: number;
  orderBy?: 'sequence' | 'name' | 'startDate' | 'releaseDate';
  expand?: string;
}

export class ProjectEP {
  constructor( private api: RestAPI ) {}
  // Create project
  // POST /rest/api/2/project
  async create( project: CreateProjectArg ) {
    const path = `/rest/api/2/project`;
    const res = await this.api.post( path, project );
    return res as CreateProjectResponse;
  }

  // Get all projects
  // GET /rest/api/2/project
  async getAll( expand?: ExpandKey[] ) {
    const path = `/rest/api/2/project`;
    const res = await this.api.get( path, { query: { expand: expand } } );
    return res as GetAllProjectResponse[];
  }

  // Get project
  // GET /rest/api/2/project/{projectIdOrKey}
  async get( idOrKey: string, expand?: ExpandKey[] ) {
    const path = `/rest/api/2/project/${idOrKey}`;
    const res = await this.api.get( path, { query: { expand: expand } } );
    return res as GetProjectResponse;
  }

  // Update project
  // PUT /rest/api/2/project/{projectIdOrKey}
  async update( idOrKey: string, project: UpdateProjectArg, expand?: ExpandKey[] ) {
    const path = `/rest/api/2/project/${idOrKey}`;
    const res = await this.api.put( path, project, { query: { expand: expand } } );
    return res as UpdateProjectResponse;
  }

  // Delete project
  // DELETE /rest/api/2/project/{projectIdOrKey}
  async delete( idOrKey: string ) {
    const path = `/rest/api/2/project/${idOrKey}`;
    await this.api.delete( path );
  }

  // Archive project
  // PUT /rest/api/2/project/{projectIdOrKey}/archive
  async archive( idOrKey: string ) {
    const path = `/rest/api/2/project/${idOrKey}/archive`;
    await this.api.put( path );
  }

  // Get project components
  // GET /rest/api/2/project/{projectIdOrKey}/components
  async getComponents( idOrKey: string ) {
    const path = `/rest/api/2/project/${idOrKey}/components`;
    const res = await this.api.get( path );
    return res as Component[];
  }

  // Restore project
  // PUT /rest/api/2/project/{projectIdOrKey}/restore
  async restore( idOrKey: string ) {
    const path = `/rest/api/2/project/${idOrKey}/restore`;
    await this.api.put( path );
  }

  // Get all statuses
  // GET /rest/api/2/project/{projectIdOrKey}/statuses
  async statuses( idOrKey: string ) {
    const path = `/rest/api/2/project/${idOrKey}/statuses`;
    const res = await this.api.get( path );
    return res;
  }

  // Update project type
  // PUT /rest/api/2/project/{projectIdOrKey}/type/{newProjectTypeKey}
  async updateProjectType( idOrKey: string, projectTypeKey: string ) {
    const path = `/rest/api/2/project/${idOrKey}/type/${projectTypeKey}`;
    const res = await this.api.put( path );
    return res as UpdateProjectResponse;
  }

  // Get project versions paginated
  // GET /rest/api/2/project/{projectIdOrKey}/version
  async getVersionsPagenated( idOrKey: string, query?: VersionsQuery ) {
    const path = `/rest/api/2/project/${idOrKey}/version`;
    const res = await this.api.get( path, { query: query } );
    return res as PagenatedList<Version>;
  }

  // Get project versions
  // GET /rest/api/2/project/{projectIdOrKey}/versions
}
