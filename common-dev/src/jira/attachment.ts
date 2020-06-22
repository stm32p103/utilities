import { RestAPI } from '../rest-api'
import { User } from './user';
import { ResponseOf } from './common/types';

export interface AttachmentMeta {
  enabled: boolean;
  uploadLimit: number;
}

export interface Attachment {
  author?:     User;
  content?:    string;
  created?:    string;
  filename?:   string;
  mimeType?:   string;
//  properties?: Properties;
  self?:       string;
  size:        number;
  thumbnail?:  string;
}

export class AttachmentEP {
  constructor( private api: RestAPI ) {}

  async get( id: string ) {
    const path = `/rest/api/2/attachment/${id}`;
    const res = await this.api.get( path );
    return res as ResponseOf<Attachment>;
  }
  
  async remove( id: string ) {
    const path = `/rest/api/2/attachment/${id}`;
    await this.api.delete( path );
  }
  
  async getMeta() {
    const path = `/rest/api/2/attachment/meta`;
    const res = await this.api.get( path );
    return res as AttachmentMeta;
  }
}
