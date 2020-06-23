import { RestAPI } from '../rest-api'
import { User } from './user';
import { RequiresKey, RequiresOneKey, SubKeyof } from './common/types';
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

export type ProjectIdOrKey = SubKeyof<Project, 'id' | 'key'>;
export type ProjectIdentifier = string | RequiresOneKey<Project, ProjectIdOrKey>;

export type ConcreteProject = RequiresKey<Project, ProjectIdOrKey>;
type GetAllKey = SubKeyof<Project, 'id' | 'key' | 'name' | 'avatarUrls' | 'projectCategory'>;
type GetKey = SubKeyof<Project, 'id' | 'key' | 'description' | 'lead' | 'components' | 'issueTypes' | 'assigneeType' | 'versions' | 'name' | 'roles' | 'avatarUrls' | 'projectTypeKey' | 'archived'>;
type ExpandKey = SubKeyof<Project, 'description' | 'lead' | 'url' | 'projectKeys'>;

export type GetProject = RequiresKey<Project, GetKey>;
export type GetAllProject = RequiresKey<Project, GetAllKey>;

function getIdOrKey( project: ProjectIdentifier ) {
  let res = '';
  if( typeof project === 'string' ) {
    res = project;
  } else{
    // prioritize id
    res = project?.id || project?.key; 
  }
  return res;
}

export class ProjectEP {
  constructor( private api: RestAPI ) {}
  // Create project
  // POST /rest/api/2/project

  // Get all projects
  // GET /rest/api/2/project
  async getAll( expand?: ExpandKey[] ) {
    const path = `/rest/api/2/project`;
    const res = await this.api.get( path, { query: { expand: expand } } );
    return res as GetAllProject[];
  }

  // Get project
  // GET /rest/api/2/project/{projectIdOrKey}
  async get( project: ProjectIdentifier, expand?: ExpandKey[] ) {
    const id = getIdOrKey( project );
    const path = `/rest/api/2/project/${id}`;
    const res = await this.api.get( path, { query: { expand: expand } } );
    return res as GetProject;
  }

  // Update project
  // PUT /rest/api/2/project/{projectIdOrKey}
  async update( project: ProjectIdentifier ) {
    const id = getIdOrKey( project );
    const path = `/rest/api/2/project/${id}`;
    const res = await this.api.put( path, project );
    return res as ConcreteProject;
  }

  // Get project components
  // GET /rest/api/2/project/{projectIdOrKey}/components
  async getComponents( project: ProjectIdentifier ) {
    const id = getIdOrKey( project );
    const path = `/rest/api/2/project/${id}/components`;
    const res = await this.api.get( path );
    return res as ConcreteComponent[];
  }
}
