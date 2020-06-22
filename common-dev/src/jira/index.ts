import { RestAPI } from '../rest-api/rest-api'
import { IssueEP } from './issue';
import { AttachmentEP } from './attachment';
import { UserEP } from './user';
import { UserAvatarEP } from './user-avatar';

export class Jira {
  public readonly issue: IssueEP;
  public readonly attachment: AttachmentEP;
  public readonly user: UserEP;
  public readonly userAvatar: UserAvatarEP;

  constructor( private api: RestAPI ) {
    this.issue = new IssueEP( this.api );
    this.attachment = new AttachmentEP( this.api );
    this.user = new UserEP( this.api );
    this.userAvatar = new UserAvatarEP( this.api );
  }
}
