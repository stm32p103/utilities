import { RestAPI } from '../rest-api'
import { SimpleListWrapper, RequiresOne } from './common/types';
import { AvatarCreatorEP, AvatarImage, CreateFromTemporaryArg, UpdateAvatarRequiredArg } from './common/avatar-creator';

import { AvatarUrls, AvatarList } from './avatar';
import { Group } from './group';

export interface User {
  active:            boolean;
  applicationRoles?: SimpleListWrapper<string>;
  avatarUrls?:       AvatarUrls;
  displayName?:      string;
  emailAddress?:     string;
  expand?:           string;
  groups?:           SimpleListWrapper<Group>;
  key?:              string;
  locale?:           string;
  name?:             string;
  self?:             string;
  timeZone?:         string;
}

/**
 * key or username to specify user.
 */
export type UserSpecifier = RequiresOne<Pick<User, 'key' | 'name'>>;

type AssignableUserQueryCommon = {
  username?: string;
  startAt?: number;
  maxResults?: number;
}

type AssignableUserQueryForEdit = AssignableUserQueryCommon & {
  issueKey: string;
}

type AssignableUserQueryForCreate = AssignableUserQueryCommon & {
  project: string;
}

type BulkAssignableUserQuery = AssignableUserQueryCommon & {
  projectKeys: string[];
}

type AssignableUserQuery = AssignableUserQueryForEdit | AssignableUserQueryForCreate;

type GetUserQuery = {
  username?: string;
  key?: string;
}


export class UserEP {
  private readonly avatar: AvatarCreatorEP;
  constructor( private api: RestAPI ) {
    this.avatar = new AvatarCreatorEP( this.api );
  }

  // Get user
  // GET /rest/api/2/user
  async get( query: GetUserQuery ) {
    const path = `/rest/api/2/user`;
    const res = await this.api.get( path, { query: query } );
    return res;
  }

  // Find bulk assignable users
  // GET /rest/api/2/user/assignable/multiProjectSearch
  async findBulkAssignable( query: BulkAssignableUserQuery ){
    const path = `/rest/api/2/user/assignable/multiProjectSearch`;
    const res = await this.api.get( path, { query: query } );
    return res.data as User[];
  }

  // Find assignable users
  // GET /rest/api/2/user/assignable/search
  async findAssignable( query: AssignableUserQuery ){
    const path = `/rest/api/2/user/assignable/search`;
    const res = await this.api.get( path, { query: query } );
    return res as User[];
  }

  /**
   * Create avatar from temporary
   * 
   * POST /rest/api/2/user/avatar
   * @param username 
   * @param crop Avatar cropping instruction.
   * @returns Created avatar.
   */
  async createAvatarFromTemporary( username: string, crop: CreateFromTemporaryArg ) {
    const res = await this.avatar.createFromTemporary( { 
      path: `/rest/api/2/user/avatar`,
      query: { username: username } 
    }, crop );
    return res;
  }

  /**
   * Store temporary avatar
   * 
   * POST /rest/api/2/user/avatar/temporary
   * @param username 
   * @param image 
   */
  async storeTemporaryAvater( username: string, image: AvatarImage ) {
    const res = await this.avatar.storeTemporaryAvater( { 
      path: `/rest/api/2/user/avatar/temporary`,
      query: { username: username } 
    }, image );
    return res;
  }

  /** 
   * Update user avatar
   * 
   * PUT /rest/api/2/user/avatar
   * @param username 
   * @param avatar 
   */
  async updateAvatar( username: string, avatar: UpdateAvatarRequiredArg ) {
    await this.avatar.update( { 
      path: `/rest/api/2/user/avatar`,
      query: { username: username } 
    }, avatar );
  }

  /**
   * Delete avatar
   * 
   * DELETE /rest/api/2/user/avatar/{id}
   * @param username 
   * @param avatarId 
   */
  async deleteAvatar( username: string, avatarId: string ) {
    const path = `/rest/api/2/user/avatar/${avatarId}`;
    await this.api.delete( path, { query: { username: username } } );
 }

  /**
   * Get all avatars
   * 
   * GET /rest/api/2/user/avatars
   * @param username 
   * @returns All avatars which are visible for the currently logged in user.
   */
  async getAllAvatars( username: string ) {
    const path = `/rest/api/2/user/avatars`;
    const res = await this.api.get( path, { query: { username: username } } );
    return res as AvatarList;
  }
}

