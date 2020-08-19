
import { promises } from 'fs';
import { TmpPool } from '@stm32p103/tmp-pool';

export class TmpFiles {
  private paths: string[] = [];
  constructor( private pool: TmpPool ) {}
  async create( value: string, encoding: BufferEncoding ) {
    const path = await this.pool.acquire();
    this.paths.push( path );
    await promises.writeFile( path, value, { encoding: encoding } );
    return path;
  }

  dispose() {
    this.paths.forEach( path => this.pool.release( path ) );
  }
}

