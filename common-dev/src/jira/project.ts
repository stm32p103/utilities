import { RestAPI } from '../rest-api'
import { User } from './user';
import { RequiresKey } from './common/types';
import { AvatarUrls } from './avatar';
import { ConcreteComponent } from './component';
import { ConcreteProjectCategory } from './project-category';

export enum AssigneeType {
  ProjectLead = "PROJECT_LEAD",
  Unassigned = "UNASSIGNED",
}

export interface Project {
  archived?:        boolean;
  assigneeType?:    AssigneeType;
  avatarUrls?:      AvatarUrls;
  components?:      ConcreteComponent[];
  description?:     string;
  email?:           string;
  expand?:          string;
  id?:              string;
  issueTypes?:      IssueType[];
  key?:             string;
  lead?:            User;
  name?:            string;
  projectCategory?: ConcreteProjectCategory;
  projectKeys?:     string[];
  projectTypeKey?:  string;
  // roles?:           Roles;
  self?:            string;
  url?:             string;
  // versions?:        Version[];
}

export type ConcreteProject = RequiresKey<Project, 'id'>;

export class ProjectEP {
  constructor( private api: RestAPI ) {}

  async get( projectIdOrKey: string ) {
    const path = `/rest/api/2/project/${projectIdOrKey}`;
    const res = await this.api.get( path );
    return res as Project;
  }

  // Get project components
  // GET /rest/api/2/project/{projectIdOrKey}/components
  async getComponents( projectIdOrKey: string ) {
    const path = `/rest/api/2/project/${projectIdOrKey}/components`;
    const res = await this.api.get( path );
    return res as ConcreteComponent[];
  }
}
