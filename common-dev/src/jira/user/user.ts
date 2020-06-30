import { RestAPI } from '../../rest-api'
import { SimpleListWrapper, RequiresOne, RequiresKey } from '../common/types';
import { AvatarCreatorEP, AvatarImage, CreateFromTemporaryArg, UpdateAvatarRequiredArg } from '../common/avatar-creator';

import { AvatarUrls, AvatarList } from '../avatar';
import { Group } from '../group';

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

export interface UserPickerResults {
  header: string;
  total:  number;
  users:  UserPickerUser[];
}

export interface UserPickerUser {
  avatarURL?:   string;
  displayName:  string;
  html:         string;
  key:          string;
  name:         string;
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

type FindAssignableUserQuery = AssignableUserQueryCommon & {
  issueKey?: string;
  project?: string;
}

type FindBulkAssignableUserQuery = AssignableUserQueryCommon & {
  projectKeys?: string[];
}

type FindUsersWithAllPermissionsQuery = AssignableUserQueryCommon & {
  issueKey?: string;
  projectKey?: string;
  permissions: string[];  // https://docs.atlassian.com/DAC/javadoc/jira/6.0/reference/com/atlassian/jira/security/Permissions.Permission.html
}

type FindUsersForPickerQuery = {
  query: string; // username or email
  maxResults?: number;
  showAvatar?: boolean;
  exclude?: string;
}

type FindUsersQuery = AssignableUserQueryCommon & {
  includeActive?: boolean;
  includeInactive?: boolean;
}

type GetUserQuery = {
  username?: string;
  key?: string;
  includeDeleted?: boolean;
}

const GetUserResponseKeys = [
  'self',
  'key',
  'name',
  'emailAddress',
  'avatarUrls',
  'displayName',
  'active',
  'timeZone',
  'locale',
  'groups',
  'applicationRoles',
  'expand'
] as const;
type GetUserResponse = RequiresKey<User, typeof GetUserResponseKeys[number]>;

const FindBulkAssignableKeys = [
  'self',
  'key',
  'name',
  'emailAddress',
  'avatarUrls',
  'displayName',
  'active',
  'timeZone',
  'locale'
] as const;
type FindBulkAssignableResponse = RequiresKey<User, typeof FindBulkAssignableKeys[number]>;
type FindAssignableResponse = FindBulkAssignableResponse;
type FindUsersWithAllPermissionsResponse = FindBulkAssignableResponse;
type FindUsersForPickerResponse = FindBulkAssignableResponse;
type FindUsersResponse = FindBulkAssignableResponse;

export class UserEP {
  private readonly avatar: AvatarCreatorEP;
  constructor( private api: RestAPI ) {
    this.avatar = new AvatarCreatorEP( this.api );
  }

  /**
   * Get user
   * 
   * GET /rest/api/2/user
   * @param query 
   * @returns User.
   */  
  async get( query: GetUserQuery ) {
    const path = `/rest/api/2/user`;
    const res = await this.api.get( path, { query: query } );
    return res as GetUserResponse;
  }

  /**
   * Find bulk assignable users
   * 
   * GET /rest/api/2/user/assignable/multiProjectSearch
   * @param query
   * @returns List of users that match the search string and can be assigned issues for all the given projects.
   */
  async findBulkAssignable( query: FindBulkAssignableUserQuery ){
    const path = `/rest/api/2/user/assignable/multiProjectSearch`;
    const res = await this.api.get( path, { query: query } );
    return res as FindBulkAssignableResponse[];
  }

  /**
   * Find assignable users
   * 
   * GET /rest/api/2/user/assignable/search
   * This resource cannot be accessed anonymously. Please note that this resource should be called with an issue key when a list of assignable users is retrieved for editing. For create only a project key should be supplied. The list of assignable users may be incorrect if it's called with the project key for editing.
   * @param query 
   * @returns list of users that match the search string. 
   */
  async findAssignable( query: FindAssignableUserQuery ){
    const path = `/rest/api/2/user/assignable/search`;
    const res = await this.api.get( path, { query: query } );
    return res as FindAssignableResponse[];
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

  async findUsersWithAllPermissions( query: FindUsersWithAllPermissionsQuery ) {
    const path = `/rest/api/2/user/permission/search`;
    const res = await this.api.get( path, { query: query } );
    return res as FindUsersWithAllPermissionsResponse[];
  }

  async findUsersForPicker( query: FindUsersForPickerQuery ) {
    const path = `/rest/api/2/user/picker`;
    const res = await this.api.get( path, { query: query } );
    return res as UserPickerResults;
  }

  async findUsers( query: FindUsersQuery ) {
    const path = `/rest/api/2/user/search`;
    const res = await this.api.get( path, { query: query } );
    return res as FindUsersResponse[];
  }
}
