import { RestAPI } from '../rest-api/rest-api'
import { IssueEP } from './issue';
import { AttachmentEP } from './attachment';
import { AvatarEP } from './avatar';
import { ComponentEP } from './component';
import { CustomFieldsEP } from './custom-fields';
import { CustomFieldsOptionEP } from './custom-field-option';
import { ProjectEP } from './project/project';
import { ProjectTypeEP } from './project-type';
import { ProjectCategoryEP } from './project-category';
import { UserEP } from './user';
import { VersionEP } from './version';

export class Jira {
  public readonly avatar: AvatarEP;
  public readonly issue: IssueEP;
  public readonly attachment: AttachmentEP;
  public readonly component: ComponentEP;
  public readonly customFields: CustomFieldsEP
  public readonly customFieldOption: CustomFieldsOptionEP
  public readonly project: ProjectEP;
  public readonly projectCategory: ProjectCategoryEP;
  public readonly projectType: ProjectTypeEP;
  public readonly user: UserEP;
  public readonly version: VersionEP;

  constructor( private api: RestAPI ) {
    this.avatar = new AvatarEP( this.api );
    this.issue = new IssueEP( this.api );
    this.attachment = new AttachmentEP( this.api );
    this.component = new ComponentEP( this.api );
    this.customFields = new CustomFieldsEP( this.api );
    this.customFieldOption = new CustomFieldsOptionEP( this.api );
    this.project = new ProjectEP( this.api );
    this.projectCategory = new ProjectCategoryEP( this.api );
    this.projectType = new ProjectTypeEP( this.api );
    this.user = new UserEP( this.api );
    this.version = new VersionEP( this.api );
  }
}
