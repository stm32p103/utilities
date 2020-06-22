import { RestAPI } from '../rest-api/rest-api'
import { IssueEP } from './issue';
import { AttachmentEP } from './attachment';
import { UserEP } from './user';
import { UserAvatarEP } from './user-avatar';
import { ProjectEP } from './project';
import { ProjectCategoryEP } from './project-category';

export class Jira {
  public readonly issue: IssueEP;
  public readonly attachment: AttachmentEP;
  public readonly user: UserEP;
  public readonly userAvatar: UserAvatarEP;
  public readonly project: ProjectEP;
  public readonly projectCategory: ProjectCategoryEP;

  constructor( private api: RestAPI ) {
    this.issue = new IssueEP( this.api );
    this.attachment = new AttachmentEP( this.api );
    this.user = new UserEP( this.api );
    this.userAvatar = new UserAvatarEP( this.api );
    this.project = new ProjectEP( this.api );
    this.projectCategory = new ProjectCategoryEP( this.api );
  }
}
