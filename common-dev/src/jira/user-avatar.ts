import { RestAPI } from '../rest-api/rest-api'

export type AvatarType = 'system' | 'custom';
export type AvatarList = { [P in AvatarType]?: Avatar[] };

export type AvatarSize = '48x48' | '32x32' | '24x24' | '16x16';
export type AvatarUrls = { [P in AvatarSize]?: string };


export interface Avatar {
  id?:            string;
  isDeletable:    boolean;
  isSelected:     boolean;
  isSystemAvatar: boolean;
  owner?:         string;
  selected:       boolean;
  urls?:          AvatarUrls;
}

export interface AvaterCropping {
  cropperOffsetX: number;   // left
  cropperOffsetY: number;   // top
  cropperWidth:   number;   // radius of avatar
  needsCropping:  boolean;
}

export class UserAvatarEP {
  constructor( private api: RestAPI ) {}

  // Create avatar from temporary
  // POST /rest/api/2/user/avatar
  async createFromTemporary( username: string, crop: AvaterCropping ) {
    const path = `/rest/api/2/user/avatar`;
    const res = await this.api.post( path, crop, { 
      headers: { 
        'Content-Type': 'application/json',
        'X-Atlassian-Token': 'no-check'
      }, 
      query: {
        username: username
      }
    } );

    return res as Avatar;
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

    return res as AvaterCropping;
  }

  // Update project avatar
  // PUT /rest/api/2/user/avatar
  async update( username: string, data: Avatar ) {
    const path = `/rest/api/2/user/avatar`;
    const res = await this.api.put( path, JSON.stringify( data ), {
      headers: {
        'Content-Type': 'application/json',
        'X-Atlassian-Token': 'no-check'
      },
      query: {
        username: username
      }
    } );

    return res as Avatar;
  }

  // Delete avatar
  // DELETE /rest/api/2/user/avatar/{id}
  async delete( username: string, avatarId: string ) {
    const path = `/rest/api/2/user/avatar/${avatarId}`;
    const res = await this.api.delete( path , { 
      query: {
        username: username
      }
    } );
  }

  // Get all avatars
  // GET /rest/api/2/user/avatars
  async get( username: string ) {
    const path = `/rest/api/2/user/avatars`;
    const res = await this.api.get( path , { 
      query: {
        username: username
      }
    } );
    return res as AvatarList;
  }
}
