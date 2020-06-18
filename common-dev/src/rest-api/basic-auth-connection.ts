import axios from 'axios';

export interface BasicAuthCredential {
  username: string;
  password: string;
}

export class BasicAuthConnection {
  constructor( private readonly auth: BasicAuthCredential ) {}
  async get( url: string, headers?: RequestHeader ): Promise<any> {
    return await axios.get( url, {
      auth: { ...this.auth },
      headers: headers
    } );
  }
  async delete( url: string, headers?: RequestHeader ): Promise<any> {
    return await axios.delete( url, {
      auth: { ...this.auth },
      headers: headers
    } );
  }
  async post( url: string, data: any, headers?: RequestHeader ): Promise<any> {
    return await axios.post( url, data, {
      auth: { ...this.auth },
      headers: headers
    } );
  }
}