import { RestAPI } from '../../rest-api'
import { SelectProperty, ReplaceType, RequiresKey, RequiresOne } from '../common/types';
import { User, UserSpecifier } from '../user';

/**
 * Options for of "Default assignee".
 */
export type AssigneeType = 'COMPONENT_LEAD' | 'PROJECT_DEFAULT' | 'PROJECT_LEAD' | 'UNASSIGNED';

/**
 * Jira REST API: Component
 */
export interface Component {
  archived?:           boolean;
  assignee?:           User;          // response only
  assigneeType?:       AssigneeType;
  description?:        string;
  id?:                 string;
  isAssigneeTypeValid: boolean;       // response only
  lead?:               User;
  leadUserName?:       string;        // create, update only
  name?:               string;
  project?:            string;
  projectId?:          number;        // create, update only
  realAssignee?:       User;          // response only
  realAssigneeType?:   AssigneeType;  // response only
  self?:               string;        // response only
}

export interface ComponentRelatedIssueCounts {
  issueCount: number;
  self?:      string;
}

const CreateComponentRequiredArgKeys = [
  'name',
  'project',
  'projectId'
] as const;
const CreateComponentOptionalArgKeys = [ 
  'assigneeType',
  'description',
  'lead',
  'leadUserName',
] as const;
export type CreateComponentArg = RequiresOne<
    ReplaceType<SelectProperty<Component, 
      typeof CreateComponentRequiredArgKeys[number],
      typeof CreateComponentOptionalArgKeys[number]>,
    User, UserSpecifier>,
  'project' | 'projectId'> // at least specify project or projectId

const  CreateComponentResponseKeys = [
  'self',        
  'id',
  'name',        
  'description', 
  'lead',        
  'assigneeType',
  'assignee',    
  'realAssigneeType',
  'realAssignee',
  'isAssigneeTypeValid',
  'project',
  'projectId',
  'archived'
] as const;
export type CreateComponentResponse = RequiresKey<Component, typeof CreateComponentResponseKeys[number]>;
export type GetComponentResponse = CreateComponentResponse;
export type UpdateComponentResponse = CreateComponentResponse;

const UpdateComponentRequiredArgKeys = [] as const;
const UpdateComponentOptionalArgKeys = [
  'name',
  'description',
  'lead',             // Component lead
  'assigneeType'      // Default assignee
] as const;
export type UpdateComponentArg = ReplaceType<SelectProperty<Component, typeof UpdateComponentRequiredArgKeys[number], typeof UpdateComponentOptionalArgKeys[number]>, User, UserSpecifier>;

/**
 * Component endpoint
 * 
 * api/2/projectCategory
 */
export class ComponentEP {
  constructor( private api: RestAPI ) {}

  /**
   * Create project category
   * 
   * POST /rest/api/2/projectCategory
   * @param component fields to create component
   */
  async create( component: CreateComponentArg ) {
    const path = `/rest/api/2/component`;
    const res = await this.api.post( path, component );
    return res as CreateComponentResponse;
  }

  /**
   * Get component
   * 
   * GET /rest/api/2/component/{id}
   * @param id component id
   */
  async get( id: string ) {
    const path = `/rest/api/2/component/${id}`;
    const res = await this.api.get( path );
    return res as GetComponentResponse;
  }

  /**
   * Update component
   * 
   * PUT /rest/api/2/component/{id}
   * @param id component id
   * @param component fields to update
   * @returns updated component
   */
  async update( id: string, component: UpdateComponentArg ) {
    const path = `/rest/api/2/component/${id}`;
    const res = await this.api.put( path, component );
    return res as UpdateComponentResponse;
  }
  
  /**
   * Delete component
   * 
   * DELETE /rest/api/2/component/{id}
   * @param id component id
   */
  async delete( id: string ) {
    const path = `/rest/api/2/component/${id}`;
    await this.api.delete( path );
  }

  /**
   * Get component related issues
   * 
   * GET /rest/api/2/component/{id}/relatedIssueCounts
   * @param id component id
   * @returns related issue counts
   */
  async getRelatedIssueCounts( id: string ) {
    const path = `/rest/api/2/component/${id}/relatedIssueCounts`;
    const res = await this.api.get( path );
    return res as ComponentRelatedIssueCounts;
  }
}
