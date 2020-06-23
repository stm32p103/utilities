import { RestAPI } from '../rest-api/rest-api'
import { IssueEP } from './issue';
import { AttachmentEP } from './attachment';
import { AvatarEP } from './avatar';
import { ComponentEP } from './component';
import { ProjectEP } from './project';
import { ProjectTypeEP } from './project-type';
import { ProjectCategoryEP } from './project-category';
import { UserEP } from './user';
import { UserAvatarEP } from './user-avatar';

export class Jira {
  public readonly issue: IssueEP;
  public readonly attachment: AttachmentEP;
  public readonly component: ComponentEP;
  public readonly project: ProjectEP;
  public readonly projectCategory: ProjectCategoryEP;
  public readonly projectType: ProjectTypeEP;
  public readonly user: UserEP;
  public readonly userAvatar: UserAvatarEP;

  constructor( private api: RestAPI ) {
    const avatar = new AvatarEP( this.api );
    this.issue = new IssueEP( this.api );
    this.attachment = new AttachmentEP( this.api );
    this.component = new ComponentEP( this.api );
    this.project = new ProjectEP( this.api );
    this.projectCategory = new ProjectCategoryEP( this.api );
    this.projectType = new ProjectTypeEP( this.api );
    this.user = new UserEP( this.api );
    this.userAvatar = new UserAvatarEP( avatar );
  }
}
