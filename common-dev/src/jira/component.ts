import { RestAPI } from '../rest-api'
import { RequiresKey, SelectProperty, Replace } from './common/types';
import { User } from './user';

export type AssigneeType = 'COMPONENT_LEAD' | 'PROJECT_DEFAULT' | 'PROJECT_LEAD' | 'UNASSIGNED';

export interface Component {
  archived?:           boolean;
  assignee?:           User;
  assigneeType?:       AssigneeType;
  description?:        string;
  id?:                 string;
  isAssigneeTypeValid: boolean;
  lead?:               User;
  leadUserName?:       string;
  name?:               string;
  project?:            string;
  projectId?:          number;
  realAssignee?:       User;
  realAssigneeType?:   AssigneeType;
  self?:               string;
}


export interface ComponentRelatedIssueCounts {
  issueCount: number;
  self?:      string;
}

export type CreateComponentArg = SelectProperty<Component, 
    'name'
  | 'project'         // project key
  , 'assigneeType'
  | 'description'
  | 'lead'            //  user with name or key or id
  | 'realAssigneeType'>;

export type UpdateComponentArg = Component;

export type CreateComponentResponse = SelectProperty<Component,
    'id'
  | 'name'
  | 'assigneeType'
  | 'realAssigneeType'
  | 'realAssignee'
  | 'isAssigneeTypeValid'
  | 'project'
  | 'projectId'
  | 'archived', never>;

export type GetComponentResponse = SelectProperty<Component,
'id'
| 'name'
| 'assigneeType'
| 'realAssigneeType'
| 'realAssignee'
| 'isAssigneeTypeValid'
| 'project'
| 'projectId'
| 'archived', never>;

// api/2/projectCategory
export class ComponentEP {
  constructor( private api: RestAPI ) {}

  // Create project category
  // POST /rest/api/2/projectCategory
  async create( component: CreateComponentArg ) {
    const path = `/rest/api/2/component`;
    const res = await this.api.post( path, component );
    return res as CreateComponentResponse;
  }

  // Get component
  // GET /rest/api/2/component/{id}
  async get( id: string ) {
    const path = `/rest/api/2/component/${id}`;
    const res = await this.api.get( path );
    return res as GetComponentResponse;
  }

  // Update component
  // PUT /rest/api/2/component/{id}
  async update( component: UpdateComponentArg ) {
    const path = `/rest/api/2/component/${component.id}`;
    const res = await this.api.put( path, component );
    return res as Component;
  }
  
  // Delete
  // DELETE /rest/api/2/component/{id}
  async delete( id: string ) {
    const path = `/rest/api/2/component/${id}`;
    await this.api.delete( path );
  }

  // Get component related issues
  // GET /rest/api/2/component/{id}/relatedIssueCounts
  async getRelatedIssueCounts( id: string ) {
    const path = `/rest/api/2/component/${id}/relatedIssueCounts`;
    const res = await this.api.get( path );
    return res as ComponentRelatedIssueCounts;
  }
}
