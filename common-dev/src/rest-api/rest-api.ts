import { query2string } from './query';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

type KeyValue<T> = { [key: string]: T };

export interface RequestOption {
  headers?: KeyValue<string>;
  query?: KeyValue<any>;
}

export interface RestApiAuth {
  username: string;
  password: string;
}

export interface RestApiResponse<T> {
  data: T;
  status: number;
  cookies: string[];
}

export class RestAPI {
  private readonly axios: AxiosInstance;
  constructor( base: URL ) {
    this.axios = axios.create( {
      baseURL: base.toString()
    } );
  }

  configureAuth( auth: RestApiAuth ) {
    this.axios.defaults.auth = { ...auth };
  }

  private mergePath( path: string, query: { [ key: string ]: any } ) {
    return path + query2string( query );
  }

  private fromResponse( res: AxiosResponse ): RestApiResponse<any> {
    const cookies = res.headers['set-cookie'] as string[];
    return {
      data: res.data,
      status: res.status,
      cookies: cookies
    };
  }

  async get( path: string, option?: RequestOption ) {
    const res = await this.axios.get( this.mergePath( path, option?.query || {} ), { headers: option?.headers || {} } );
    return this.fromResponse( res );
  }

  async delete( path: string, option?: RequestOption ) {
    const res = await this.axios.delete( this.mergePath( path, option?.query || {} ), { headers: option?.headers || {} } );
    return this.fromResponse( res );
  }

  async post( path: string, data: any, option?: RequestOption ) {
    const res = await this.axios.post( this.mergePath( path, option?.query || {} ), data, { headers: option?.headers || {} } );
    return this.fromResponse( res );
  }

  async put( path: string, data: any, option?: RequestOption ) {
    const res = await this.axios.put( this.mergePath( path, option?.query || {} ), data, { headers: option?.headers || {} } );
    return this.fromResponse( res );
  }
}
