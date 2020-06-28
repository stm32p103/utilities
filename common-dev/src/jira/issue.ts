import { RestAPI } from '../rest-api'
import { Attachment } from './attachment';
import { MultipartFormPoster } from './common/multipart-form-poster'

export type FieldName = 'renderedFields' | 'names' | 'schema' | 'operations' | 'editmeta' | 'changelog' | 'versionedRepresentations';

export class IssueEP {
  constructor( private api: RestAPI ) {}
  async create( project: {key?: string, id?: string}, fields: any ) {
    const path = `/rest/api/2/issue`;

    const res = await this.api.post( path,
      JSON.stringify( {
        fields: {
          project: project,
          ...fields
        }
      } ), {
        headers: {
          'Content-Type': 'application/json'
        }
      } );
    return res;
  }

  async get( issueIdOrKey: string, query?: { expand: FieldName[] } ) {
    const path = `/rest/api/2/issue/${issueIdOrKey}`;
    const res = await this.api.get( path );
    return res;
  }
  
  async delete( issueIdOrKey: string, query?: { deleteSubtask: boolean } ) {
    const path = `/rest/api/2/issue/${issueIdOrKey}`;
    const res = await this.api.delete( path );
    return res;
  }

  async addAttachment( issueIdOrKey: string, filename: string, buffer: Buffer ) {
    const path = `/rest/api/2/issue/${issueIdOrKey}/attachments`;
    
    const poster = new MultipartFormPoster( this.api );
    poster.appendFile( 'file', buffer, filename );
    const res = await poster.post( path );
    return res as Attachment[];
  }
}
