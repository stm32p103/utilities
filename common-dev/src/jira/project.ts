import { RestAPI } from '../rest-api'
import { User } from './user';
import { RequiresKey, SubKeyof, Replace, SelectProperty } from './common/types';
import { AvatarUrls } from './avatar';
import { ConcreteComponent } from './component';
import { ConcreteProjectCategory } from './project-category';

export type ProjectAssigneeType = 'PROJECT_LEAD' | 'UNASSIGNED';
export interface Project {
  archived?:        boolean;
  assigneeType?:    ProjectAssigneeType;
  avatarUrls?:      AvatarUrls;
  components?:      ConcreteComponent[];
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
  versions?:        any[]; // Version[];
}

// 応答
// Jira API のSchemaに対して、一部のプロパティしか返ってこないことに注意する。
export type GetProjectResponse = RequiresKey<Project, 'id' | 'key' | 'description' | 'lead' | 'components' | 'issueTypes' | 'assigneeType' | 'versions' | 'name' | 'roles' | 'avatarUrls' | 'projectTypeKey' | 'archived'>;
export type UpdateProjectResponse = GetProjectResponse;
export type GetAllProjectResponse = RequiresKey<Project, 'id' | 'key' | 'name' | 'avatarUrls' | 'projectCategory'>;
export type CreateProjectResponse = Pick<Project, 'id' | 'key'>;

// 引数の型
// 基本的に他のオブジェクトを参照するプロパティはCreate/Updateで設定できない。
//   例えば、ComponentはComponent側で親Projectを指定する。
// leadのみ、Userの代わりにユーザ名をstringで設定する。
export type CreateProjectArg = Replace<SelectProperty<Project, 'projectTypeKey' | 'key' | 'lead' | 'name', 'description' | 'assigneeType'>, { lead: string }>;
export type UpdateProjectArg = Partial<CreateProjectArg>;
export type ExpandKey = SubKeyof<Project, 'description' | 'lead' | 'url' | 'projectKeys'>;

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

  // Get project components
  // GET /rest/api/2/project/{projectIdOrKey}/components
  async getComponents( idOrKey: string ) {
    const path = `/rest/api/2/project/${idOrKey}/components`;
    const res = await this.api.get( path );
    return res as ConcreteComponent[];
  }
}
