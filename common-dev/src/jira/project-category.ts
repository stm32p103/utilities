import { RestAPI } from '../rest-api'
import { RequiresKey } from './common/types';

export interface ProjectCategory {
  description?: string;
  id?: string;
  name?: string;
  self?: string;
}

export type ConcreteProjectCategory = RequiresKey<ProjectCategory, 'id'>;

export class ProjectCategoryEP {
  constructor( private api: RestAPI ) {}

  // Get all project categories
  // GET /rest/api/2/projectCategory
  async getAll() {
    const path = `/rest/api/2/projectCategory`;
    const res = await this.api.get( path );
    return res as ConcreteProjectCategory[];
  }
  
  // Get project category by id
  // GET /rest/api/2/projectCategory/{id}
  async get( id: string ) {
    const path = `/rest/api/2/projectCategory/${id}`;
    const res = await this.api.get( path );
    return res as ConcreteProjectCategory;
  }
  
  // Remove project category
  // DELETE /rest/api/2/projectCategory/{id}
  async delete( id: string ) {
    const path = `/rest/api/2/projectCategory/${id}`;
    await this.api.delete( path );
  }

  // Update project category
  // PUT /rest/api/2/projectCategory/{id}
  async update( projectCategory: ConcreteProjectCategory ) {
    const path = `/rest/api/2/projectCategory/${projectCategory.id}`;
    const res = await this.api.put( path, projectCategory );
    return res as ConcreteProjectCategory;
  }
}
