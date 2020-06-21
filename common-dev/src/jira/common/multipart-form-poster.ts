import * as FormData from 'form-data';
import { RestAPI } from '../../rest-api';

export class MultipartFormPoster {
  private readonly form = new FormData();
  constructor( private api: RestAPI ) {}

  appendFile( key: string, data: Buffer, filename: string ) {
    this.form.append( key, data, filename );
  }

  append( key: string, value: any ) {
    this.form.append( key, value );
  }

  async post( path: string ) {
    const res = await this.api.post( path, this.form, {
      headers: {
        ...this.form.getHeaders(),
        'X-Atlassian-Token': 'no-check'
      }
    } );
    return res;
  }
}
