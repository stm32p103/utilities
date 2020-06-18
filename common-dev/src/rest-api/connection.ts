export interface RequestOption {
  headers?: { [key: string]: string };
  query?: any;
}

export interface Connection {
  get( url: string, option?: RequestOption ): Promise<any>;
  delete( url: string, option?: RequestOption ): Promise<any>;
  post( url: string, data?: any, option?: RequestOption ): Promise<any>;
}
