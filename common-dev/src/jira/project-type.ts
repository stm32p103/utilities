import { RestAPI } from '../rest-api'
import { RequiresKey } from './common/types';

export interface ProjectType {
  color?: string;
  descriptionI18NKey?: string;
  formattedKey?: string;
  icon?: string;
  key?: string;
}

export type ConcreteProjectType = RequiresKey<ProjectType, 'key'>;

// api/2/project/type
export class ProjectTypeEP {
  constructor( private api: RestAPI ) {}

  // Get all project types
  // GET /rest/api/2/project/type
  async getAll() {
    const path = `/rest/api/2/project/type`;
    const res = await this.api.get( path );
    return res as ConcreteProjectType[];
  }
  
  // Get project type by key
  // GET /rest/api/2/project/type/{projectTypeKey}
  async get( key: string ) {
    const path = `/rest/api/2/project/type/${key}`;
    const res = await this.api.get( path );
    return res as ConcreteProjectType;
  }
  
  // Get accessible project type by key
  // GET /rest/api/2/project/type/{projectTypeKey}/accessible
  async getAccessible( key: string ) {
    const path = `/rest/api/2/project/type/${key}/accessible`;
    const res = await this.api.get( path );
    return res as ConcreteProjectType;
  }
}
