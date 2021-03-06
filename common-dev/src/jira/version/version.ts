import { RestAPI } from '../../rest-api'
import { SelectProperty, RequiresKey } from '../common/types';

export interface Version {
  archived?:            boolean;
  description?:         string;
  expand?:              string;   // not used?
  id?:                  string;
  moveUnfixedIssuesTo?: string;
  name?:                string;
  operations?:          SimpleLink[];   // expand
  overdue?:             boolean;  // readonly
  project?:             string;   // create only
  projectId?:           number;   // readonly
  released?:            boolean;
  remotelinks?:         RemoteEntityLink[];   // expand
  self?:                string;
  userReleaseDate?:     string;
  userStartDate?:       string;
  releaseDate?:         string; // not described in schema
  startDate?:           string; // not described in schema
}

export interface SimpleLink {
  href?:       string;
  iconClass?:  string;
  id?:         string;
  label?:      string;
  styleClass?: string;
  title?:      string;
  weight?:     number;
}

export interface RemoteEntityLink {
  link?: any;
  name?: string;
  self?: string;
}

const CreateVersionRequriedArgKeys = [
  'project',
  'name'
] as const;
const CreateVersionOptionalArgKeys = [
  'description',
  'releaseDate',
  'startDate'
] as const;
export type CreateVersionArg = SelectProperty<Version, typeof CreateVersionRequriedArgKeys[number], typeof CreateVersionOptionalArgKeys[number]>;


const UpdateVersionRequriedArgKeys = [
] as const;
const UpdateVersionOptionalArgKeys = [
  'name',
  'description',
  'releaseDate',
  'startDate'
] as const;
export type UpdateVersionArg = SelectProperty<Version, typeof UpdateVersionRequriedArgKeys[number], typeof UpdateVersionOptionalArgKeys[number]>;

const VersionResponseKeys = [ 'self', 'id', 'name', 'archived', 'released', 'projectId' ] as const;
export type VersionResponse = RequiresKey<Version, typeof VersionResponseKeys[number]>;

export type DeleteVersionOption = {
  moveFixIssuesTo?: string        // version id
  moveAffectedIssuesTo?: string   // version id
}

export class VersionEP {
  constructor( private readonly api: RestAPI ) {}

  /**
   * Create version
   * 
   * POST /rest/api/2/version
   * @param project 
   */
  async create( project: CreateVersionArg ) {
    const path = `/rest/api/2/version`;
    const res = await this.api.post( path, project );
    return res as VersionResponse;
  }

  /**
   * Get version
   * 
   * GET /rest/api/2/version/{id}
   * @param project 
   */
  async get( id: string, expand?: string[] ) {
    const path = `/rest/api/2/version/${id}`;
    const res = await this.api.get( path, { query: { expand: expand } });
    return res as VersionResponse;
  }

  /**
   * Update version
   * 
   * PUT /rest/api/2/version/{id}
   * @param version 
   */
  async update( id: string, version: UpdateVersionArg ) {
    const path = `/rest/api/2/version/${id}`;
    const res = await this.api.put( path, version );
    return res as VersionResponse;
  }

  /**
   * Delete
   * 
   * DELETE /rest/api/2/version/{id}
   * @param project 
   */
  async delete( id: string, option?: DeleteVersionOption ) {
    const path = `/rest/api/2/version/${id}`;
    const res = await this.api.delete( path, { query: option } );
    return res as VersionResponse;
  }

  async getRemoteVersionLinks( id: string ) {
    const path = `/rest/api/2/version/${id}/remotelink`;
    const res = await this.api.get( path );
    return res as VersionResponse;
  }

  /**
   * Delete
   * 
   * DELETE /rest/api/2/version/{id}
   * @param project 
   */
  async createOrUpdateRemoteVersionLink( id: string ) {
    const path = `/rest/api/2/version/${id}/remotelink`;
    const res = await this.api.post( path, { name: 'as' } );
    return res;
  }
}
