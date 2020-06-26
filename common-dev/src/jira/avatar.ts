import { RestAPI } from '../rest-api'
import { SelectProperty } from './common/types';
import { AvatarCreatorEP, AvatarImage, CreateFromTemporaryArg, UpdateAvatarRequiredArg } from './common/avatar-creator';

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

export interface AvaterCroppingInstruction {
  cropperOffsetX: number;   // left
  cropperOffsetY: number;   // top
  cropperWidth:   number;   // radius of avatar
  needsCropping:  boolean;
  url: string;
}

const StoreTemporaryAvaterResponseKeys = [
  'cropperWidth',
  'cropperOffsetX',
  'cropperOffsetY',
  'url',
  'needsCropping'
] as const;
export type StoreTemporaryAvaterResponse = SelectProperty<AvaterCroppingInstruction, typeof StoreTemporaryAvaterResponseKeys[number]>;

const CreateFromTemporaryResponseKeys = [
  'id',
  'owner',
  'isSystemAvatar',
  'isSelected',
  'isDeletable',
  'selected'
] as const;
export type CreateFromTemporaryAvaterResponse = SelectProperty<Avatar, typeof CreateFromTemporaryResponseKeys[number]>;

const CustomAvatarKeys = [
  'id',
  'owner',
  'isSystemAvatar',
  'isSelected',
  'isDeletable',
  'urls',
  'selected'
] as const;
const SystemAvatarKeys = [
  'id',
  'isSystemAvatar',
  'isSelected',
  'isDeletable',
  'urls',
  'selected'
] as const;

export type AvatarType = 'user' | 'project' | 'issuetype';
export interface AvatarList { 
  custom: SelectProperty<Avatar, typeof CustomAvatarKeys[number]>;
  system: SelectProperty<Avatar, typeof SystemAvatarKeys[number]>;
};
export type SystemAvatarList = SelectProperty<AvatarList, 'system'>;
export type AvatarGroup = keyof AvatarList;

export class AvatarEP {
  private avatar: AvatarCreatorEP;
  constructor( private api: RestAPI ) {
    this.avatar = new AvatarCreatorEP( this.api );
  }

  /**
   * Get all system avatars
   * 
   * GET /rest/api/2/avatar/{type}/system
   * @param type Avatar type 
   * @returns All system avatars of the given type.
   */
  async getAll( type: AvatarType ) {
    const path = `/rest/api/2/avatar/${type}/system`;
    const res = await this.api.get( path );
    return res as SystemAvatarList;
  }
  
  /**
   * Create avatar from temporary
   * 
   * POST /rest/api/2/avatar/{type}/temporaryCrop
   * @param type Avatar type 
   * @returns Updated cropping instruction.
   */
  async createFromTemporary( type: AvatarType, crop: CreateFromTemporaryArg ) {
    const path = `/rest/api/2/avatar/${type}/temporary`;
    const res = await this.avatar.createFromTemporary( { path: path }, crop );
    return res;
  }

  /**
   * Store temporary avatar
   * 
   * POST /rest/api/2/avatar/{type}/temporary
   * @param type Avatar type
   * @param image 
   * 
   */
  async storeTemporaryAvater( type: AvatarType, image: AvatarImage ) {
    const path = `/rest/api/2/avatar/${type}/temporary`;
    const res = await this.avatar.storeTemporaryAvater( { path: path }, image );
    return res;
  }

  async update( type: AvatarType, avatar: UpdateAvatarRequiredArg ) {
    const path = `/rest/api/2/avatar/${type}`;
    const res = await this.avatar.update( { path: path }, avatar );
    return res;
  }
}
