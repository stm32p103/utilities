import { RestAPI } from './rest-api'
import { Connection } from './connection';
import { Specifier } from './specifier';

import * as FormData from 'form-data';

function boolean2string( value: boolean ): BooleanString {
  return value ? 'true' : 'false';
}

export type FieldName = 'renderedFields' | 'names' | 'schema' | 'operations' | 'editmeta' | 'changelog' | 'versionedRepresentations';
export type BooleanString = 'true' | 'false';

type IdOrKeySpecifier = 'id' | 'key';
type ProjectSpeciier = IdOrKeySpecifier;

export class Jira extends RestAPI {
  constructor( connection: Connection, base: URL ) {
    super( connection, base );
  }

  async createIssue( target: Specifier<ProjectSpeciier>, query?: { expand: FieldName[] } ) {
    const path = `/rest/api/2/issue`;

    const res = await this.post( path, JSON.stringify( { fields: {
        project: target.value
      } } ), {
      headers: {
        'Content-Type': 'application/json'
      }
    } );
    return res.data;
  }
  
  async getIssue( issueIdOrKey: string, query?: { expand: FieldName[] } ) {
    const path = `/rest/api/2/issue/${issueIdOrKey}`;
    const res = await this.get( path );
    return res.data;
  }
  
  async deleteIssue( issueIdOrKey: string, query?: { deleteSubtask: boolean } ) {
    const path = `/rest/api/2/issue/${issueIdOrKey}`;
    const res = await this.delete( path );
    return res.data;
  }
  
  async addAttachment( issueIdOrKey: string, filename: string, buffer: Buffer ) {
    const path = `/rest/api/2/issue/${issueIdOrKey}/attachments`;

    const form = new FormData();
    form.append( 'file', buffer, filename );
    const res = await this.post( path, form, {
      headers: {
        ...form.getHeaders(),
        'X-Atlassian-Token': 'no-check'
      } 
    } );
    return res.data;
  }
}
