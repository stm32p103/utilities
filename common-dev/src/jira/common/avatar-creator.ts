import { RestAPI, RequestQuery } from '../../rest-api'
import { SelectProperty } from './types';
import { Avatar, AvaterCroppingInstruction } from '../avatar';

export type AvatarImageMIME = 'image/jpeg' | 'image/png' | 'image/bmp' | 'image/gif' | 'image/vnd.wap.wbmp';
export interface AvatarImage {
  filename: string;
  mime: AvatarImageMIME;
  buffer: Buffer;
}

export interface AvatarSpecifier {
  path: string;
  query?: RequestQuery;
}

const StoreTemporaryAvaterResponseKeys = [
  'cropperWidth',
  'cropperOffsetX',
  'cropperOffsetY',
  'url',
  'needsCropping'
] as const;
export type StoreTemporaryAvaterResponse = SelectProperty<AvaterCroppingInstruction, typeof StoreTemporaryAvaterResponseKeys[number]>;

export type CreateFromTemporaryArg = Partial<AvaterCroppingInstruction>;
const CreateFromTemporaryResponseKeys = [
  'id',
  'owner',
  'isSystemAvatar',
  'isSelected',
  'isDeletable',
  'selected'
] as const;
export type CreateFromTemporaryAvaterResponse = SelectProperty<Avatar, typeof CreateFromTemporaryResponseKeys[number]>;

export type UpdateAvatarRequiredArg = SelectProperty<Avatar, 'id'>;

export class AvatarCreatorEP {
  constructor( private api: RestAPI ) {}

  async createFromTemporary( target: AvatarSpecifier, crop: CreateFromTemporaryArg ) {
    const res = await this.api.post( target.path, crop, { 
      headers: { 
        'Content-Type': 'application/json',
        'X-Atlassian-Token': 'no-check'
      }, 
      query: target?.query
    } );

    return res as CreateFromTemporaryAvaterResponse;
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

    return res as StoreTemporaryAvaterResponse;
  }

  async update( target: AvatarSpecifier, avatar: UpdateAvatarRequiredArg ) {
    const res = await this.api.put( target.path, JSON.stringify( avatar ), {
      headers: {
        'Content-Type': 'application/json',
        'X-Atlassian-Token': 'no-check'
      },
      query: target?.query
    } );
  }
}
