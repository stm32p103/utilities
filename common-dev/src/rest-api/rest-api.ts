import axios, { AxiosInstance } from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

import { query2string } from './query';
type KeyValue<T> = { [key: string]: T };

export type RequestHeader = KeyValue<string>;
export type RequestQuery = KeyValue<any>;

export interface RequestOption {
  headers?: RequestHeader;
  query?: RequestQuery;
}

export interface RestApiAuth {
  username: string;
  password: string;
}

export class RestAPI {
  private readonly axios: AxiosInstance;
  constructor( base: URL ) {
    this.axios = axios.create( {
      baseURL: base.toString()
    } );
    
    // cookie support
    axiosCookieJarSupport( this.axios );
    this.axios.defaults.withCredentials = true;
    this.axios.defaults.jar = new CookieJar();
  }

  configureAuth( auth: RestApiAuth ) {
    this.axios.defaults.auth = { ...auth };
  }

  private mergePath( path: string, query: { [ key: string ]: any } ) {
    return path + query2string( query );
  }

  async get( path: string, option?: RequestOption ) {
    const res = await this.axios.get( this.mergePath( path, option?.query || {} ), { headers: option?.headers || {} } );
    return res.data;
  }

  async delete( path: string, option?: RequestOption ) {
    const res = await this.axios.delete( this.mergePath( path, option?.query || {} ), { headers: option?.headers || {} } );
    return res.data;
  }

  async post( path: string, data: any, option?: RequestOption ) {
    const res = await this.axios.post( this.mergePath( path, option?.query || {} ), data, { headers: option?.headers || {} } );
    return res.data;
  }

  async put( path: string, data?: any, option?: RequestOption ) {
    const res = await this.axios.put( this.mergePath( path, option?.query || {} ), data || {}, { headers: option?.headers || {} } );
    return res.data;
  }
}
