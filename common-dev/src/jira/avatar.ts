import { RestAPI, RequestQuery } from '../rest-api'

export type AvatarType = 'system' | 'custom';
export type AvatarList = { [P in AvatarType]?: Avatar[] };

export type AvatarSize = '48x48' | '32x32' | '24x24' | '16x16';
export type AvatarUrls = { [P in AvatarSize]?: string };

export type AvatarImageMIME = 'image/jpeg' | 'image/png' | 'image/bmp' | 'image/gif' | 'image/vnd.wap.wbmp';
export interface AvatarImage {
  filename: string;
  mime: AvatarImageMIME;
  buffer: Buffer;
}

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

export interface AvatarSpecifier {
  path: string;
  query?: RequestQuery;
}

export class AvatarEP {
  constructor( private api: RestAPI ) {}

  async createFromTemporary( target: AvatarSpecifier, crop: AvaterCropping ) {
    const res = await this.api.post( target.path, crop, { 
      headers: { 
        'Content-Type': 'application/json',
        'X-Atlassian-Token': 'no-check'
      }, 
      query: target?.query
    } );

    return res as Avatar;
  }

  async storeTemporaryAvater( target: AvatarSpecifier, image: AvatarImage ) {
    const res = await this.api.post( target.path, image.buffer, {
      headers: {
        'Content-Type': image.mime,
        'X-Atlassian-Token': 'no-check'
      },
      query: {
        filename: image.filename,
        ...target.query
      }
    } );

    return res as AvaterCropping;
  }

  async update( target: AvatarSpecifier, avatar: Avatar ) {
    const res = await this.api.put( target.path, JSON.stringify( avatar ), {
      headers: {
        'Content-Type': 'application/json',
        'X-Atlassian-Token': 'no-check'
      },
      query: target?.query
    } );
  }

  async delete( target: AvatarSpecifier ) {
    await this.api.delete( target.path, {
      query: target?.query
    } );
  }

  async get( target: AvatarSpecifier ) {
    const res = await this.api.get( target.path, {
      query: target?.query
    } );
    return res as AvatarList;
  }
}
