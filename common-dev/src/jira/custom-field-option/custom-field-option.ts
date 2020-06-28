import { RestAPI } from '../../rest-api'

/**
 * Jira REST API: Custom Field Option
 */
export interface CustomFieldOption {
  self?:  string;
  value?: string;
}

export class CustomFieldsOptionEP {
  constructor( private api: RestAPI ) {}

  /**
   * Get custom field option
   * 
   * GET /rest/api/2/customFieldOption/{id}
   * @param id
   * @returns Custom field option
   */
  async getOption( id: string ) {
    const path = `/rest/api/2/customFieldOption/${id}`;
    const res = await this.api.get( path );
    return res as CustomFieldOption;
  }
}
