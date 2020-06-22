import { RestAPI } from '../rest-api'
import { SimpleListWrapper } from './common/types';

export interface Group {
  name?: string;
  self?: string;
}

export type AvatarUrls = { [size:string]: string};

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
  constructor( private api: RestAPI ) {}

  // Get user
  // GET /rest/api/2/user
  async get( query: GetUserQuery ) {
    const path = `/rest/api/2/user`;
    const res = await this.api.get( path, { query: query } );
    return res.data as User;
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
}

