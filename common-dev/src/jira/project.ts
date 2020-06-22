import { RestAPI } from '../rest-api'
import { User } from './user';
import { ResponseOf } from './common/types';
import { AvatarUrls } from './avatar';

export enum AssigneeType {
  ProjectLead = "PROJECT_LEAD",
  Unassigned = "UNASSIGNED",
}

export interface Project {
  archived?:        boolean;
  assigneeType?:    AssigneeType;
  avatarUrls?:      AvatarUrls;
  // components?:      Component[];
  description?:     string;
  email?:           string;
  expand?:          string;
  id?:              string;
  issueTypes?:      IssueType[];
  key?:             string;
  lead?:            User;
  name?:            string;
  // projectCategory?: ProjectCategory;
  projectKeys?:     string[];
  projectTypeKey?:  string;
  // roles?:           Roles;
  self?:            string;
  url?:             string;
  // versions?:        Version[];
}

export class ProjectEP {
  constructor( private api: RestAPI ) {}

  async get( projectIdOrKey: string ) {
    const path = `/rest/api/2/project/${projectIdOrKey}`;
    const res = await this.api.get( path );
    return res as ResponseOf<Project>;
  }
}
