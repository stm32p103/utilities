import { AvatarEP, Avatar, AvaterCropping, AvatarImage } from './avatar';
export class UserAvatarEP {
  constructor( private avatar: AvatarEP ) {}

  // Create avatar from temporary
  // POST /rest/api/2/user/avatar
  async createFromTemporary( username: string, crop: AvaterCropping ) {
    const res = await this.avatar.createFromTemporary( { 
      path: `/rest/api/2/user/avatar`,
      query: { username: username } 
    }, crop );
    return res;
  }

  // Store temporary avatar
  // POST /rest/api/2/user/avatar/temporary
  async storeTemporaryAvater( username: string, image: AvatarImage ) {
    const res = await this.avatar.storeTemporaryAvater( { 
      path: `/rest/api/2/user/avatar/temporary`,
      query: { username: username } 
    }, image );
    return res;
  }

  // Update project avatar
  // PUT /rest/api/2/user/avatar
  async update( username: string, avatar: Avatar ) {
    const res = await this.avatar.update( { 
      path: `/rest/api/2/user/avatar`,
      query: { username: username } 
    }, avatar );
  }

  // Delete avatar
  // DELETE /rest/api/2/user/avatar/{id}
  async delete( username: string, avatarId: string ) {
    await this.avatar.delete( { 
      path: `/rest/api/2/user/avatar/${avatarId}`,
      query: { username: username } 
    } );
  }

  // Get all avatars
  // GET /rest/api/2/user/avatars
  async get( username: string ) {
    const res = await this.avatar.get( { 
      path: `/rest/api/2/user/avatars`,
      query: { username: username } 
    } );
    return res;
  }
}
