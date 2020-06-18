import { Connection, RequestOption } from './connection';

export class RestAPI {
  private readonly baseUrl: string;
  constructor( private readonly connection: Connection, base: URL ) {
    this.baseUrl = base.toString().replace( /\/$/, ''); // 末尾の / を削除
  }

  private url( path: string ) {
    let url = this.baseUrl + path;
    // if( queries ) {
    //   url += '?' + queries.map( q => q.toString() ).join( '&' );
    // }
    return url;
  }

  protected async get( path: string, option?: RequestOption ) {
    return await this.connection.get( this.url( path ), option?.headers );
  }

  protected async delete( path: string, option?: RequestOption ) {
    return await this.connection.get( this.url( path ), option?.headers );
  }

  protected async post( path: string, data: any, option?: RequestOption ) {
    return await this.connection.post( this.url( path ), data, option?.headers );
  }
}
