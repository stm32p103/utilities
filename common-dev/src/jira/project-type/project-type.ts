import { RestAPI } from '../../rest-api'
import { SelectProperty } from '../common/types';

/**
 * Jira REST API: Project Type
 */
export interface ProjectType {
  color?: string;
  descriptionI18nKey?: string;
  formattedKey?: string;
  icon?: string;
  key?: string;
}

const ProjectTypeKeys = [ 'key', 'formattedKey', 'descriptionI18nKey', 'icon', 'color' ] as const;
export type ProjectTypeResponse = SelectProperty<ProjectType, typeof ProjectTypeKeys[number]>;

// api/2/project/type
export class ProjectTypeEP {
  constructor( private api: RestAPI ) {}

  /**
   * Get all project types
   * 
   * GET /rest/api/2/project/type
   * @returns Retrieved project types.
   */
  async getAll() {
    const path = `/rest/api/2/project/type`;
    const res = await this.api.get( path );
    return res as ProjectTypeResponse[];
  }
  
  /**
   * Get project type by key
   * 
   * GET /rest/api/2/project/type/{projectTypeKey}
   * @param key Project type key.
   * @returns Retrieved project type.
   */
  async get( key: string ) {
    const path = `/rest/api/2/project/type/${key}`;
    const res = await this.api.get( path );
    return res as ProjectTypeResponse;
  }
  
  /**
   * Get accessible project type by key
   * 
   * GET /rest/api/2/project/type/{projectTypeKey}/accessible
   * @param key Project type key.
   * @returns Retrieved accessible project type.
   */
  async getAccessible( key: string ) {
    const path = `/rest/api/2/project/type/${key}/accessible`;
    const res = await this.api.get( path );
    return res as ProjectTypeResponse;
  }
}
