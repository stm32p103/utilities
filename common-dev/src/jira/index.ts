import { RestAPI } from '../rest-api/rest-api'
import { IssueEP } from './issue';
import { AttachmentEP } from './attachment';
import { UserEP } from './user';
import { AvatarEP } from './avatar';
import { UserAvatarEP } from './user-avatar';
import { ProjectEP } from './project';
import { ProjectTypeEP } from './project-type';
import { ProjectCategoryEP } from './project-category';

export class Jira {
  public readonly issue: IssueEP;
  public readonly attachment: AttachmentEP;
  public readonly user: UserEP;
  public readonly userAvatar: UserAvatarEP;
  public readonly project: ProjectEP;
  public readonly projectCategory: ProjectCategoryEP;
  public readonly projectType: ProjectTypeEP;

  constructor( private api: RestAPI ) {
    const avatar = new AvatarEP( this.api );
    this.issue = new IssueEP( this.api );
    this.attachment = new AttachmentEP( this.api );
    this.user = new UserEP( this.api );
    this.userAvatar = new UserAvatarEP( avatar );
    this.project = new ProjectEP( this.api );
    this.projectCategory = new ProjectCategoryEP( this.api );
    this.projectType = new ProjectTypeEP( this.api );
  }
}
