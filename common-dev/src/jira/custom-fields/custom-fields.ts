import { RestAPI } from '../../rest-api'
import { PagenatedList } from '../common/types';

/**
 * Jira REST API: Custom Field
 */
export interface CustomField {
  description?:  string;
  id?:           string;
  isAllProjects: boolean;
  isLocked:      boolean;
  isManaged:     boolean;
  name?:         string;
  numericID?:    number;
  projectsCount: number;
  screensCount:  number;
  searcherKey?:  string;
  self?:         string;
  type?:         string;
}

interface GetCustomFieldsQuery {
  startAt: number;
  maxResults: number;
  search: string;
  projectIds: string[];
  screnIds: string[];
  types: string[];
}

export class CustomFieldsEP {
  constructor( private api: RestAPI ) {}

  /**
   * Get custom fields
   * 
   * GET /rest/api/2/customFields
   * @param query 
   */
  async get( query?: GetCustomFieldsQuery ) {
    const path = `/rest/api/2/customFields`;
    const res = await this.api.get( path, { query: query } );
    return res as PagenatedList<CustomField>;
  }
}
