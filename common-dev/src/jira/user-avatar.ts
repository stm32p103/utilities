import { RestAPI, RestApiResponse } from '../rest-api/rest-api'

export interface Avatar {
  id?:            string;
  isDeletable:    boolean;
  isSelected:     boolean;
  isSystemAvatar: boolean;
  owner?:         string;
  selected:       boolean;
  //urls?:          Urls;
}

export interface AvaterCropping {
  cropperOffsetX: number;
  cropperOffsetY: number;
  cropperWidth:   number;
  needsCropping:  boolean;
}

export class UserAvatarEP {
  constructor( private api: RestAPI ) {}
  // Create avatar from temporary
  // POST /rest/api/2/user/avatar
  async createFromTemporary( username: string, crop: AvaterCropping, cookies: string[] ) {
    const path = `/rest/api/2/user/avatar`;
    const res = await this.api.post( path, crop, { 
      headers: { 
        'Content-Type': 'application/json',
        'X-Atlassian-Token': 'no-check',
        'Cookie': cookies.join(';')
      }, 
      query: {
        username: username
      } } );
    return res as RestApiResponse<Avatar>;
  }

  // Store temporary avatar
  // POST /rest/api/2/user/avatar/temporary
  async storeTemporaryAvater( username: string, data: Buffer ) {
    const path = `/rest/api/2/user/avatar/temporary`;
    const res = await this.api.post( path, data, {
      headers: {
        'Content-Type': 'image/jpeg',
        'X-Atlassian-Token': 'no-check'
      },
      query: {
        username: username,
        filename: 'avatar.jpg',
      }
    } );

    // ; で区切られた最初の部分だけ残す
    return res as RestApiResponse<AvaterCropping>;
  }

  // Update project avatar
  // PUT /rest/api/2/user/avatar
  async update( username: string, data: any, cookies: string[] ) {
    const path = `/rest/api/2/user/avatar`;
    const stringified = JSON.stringify( data );
    const res = await this.api.put( path, stringified, {
      headers: {
        'Content-Type': 'application/json',
        'X-Atlassian-Token': 'no-check',
        'Cookie': cookies.join(';')
      },
      query: {
        username: username
      }
    } );

    // ; で区切られた最初の部分だけ残す
    return res;
  }

  // Delete avatar
  // DELETE /rest/api/2/user/avatar/{id}


  // Store temporary avatar using multi part
  // POST /rest/api/2/user/avatar/temporary

  // Get all avatars
  // GET /rest/api/2/user/avatars
}