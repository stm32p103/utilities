import { setPassword, getPassword, deletePassword, findCredentials } from 'keytar';

export class CredentialManager {
  constructor( private readonly serviceId: string ) {}

  async save( user: string, password: string ) {
    if( !user || !password ) {
      throw new RangeError( 'User and password must not be empty.' );
    }
    await setPassword( this.serviceId, user, password );
  }

  async delete( user: string ) {
    await deletePassword( this.serviceId, user );
  }

  async deleteAll() {
    const users = await this.getAllUsers();
    await Promise.all( users.map( user => this.delete( user ) ) );
  }

  async getAllUsers() {
    const credentials = await findCredentials( this.serviceId );
    return credentials.map( cred => cred.account );
  }

  async getPassword( user: string ) {
    return await getPassword( this.serviceId, user );
  }

  async check( user: string, password: string ) {
    const correctPassword = await this.getPassword( user );
    return ( correctPassword == password );
  }

  async exists( user: string ) {
    const pass = await getPassword( this.serviceId, user );
    return !!pass;
  }
}
