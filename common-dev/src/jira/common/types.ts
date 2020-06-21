export interface SimpleListWrapper<T> {
  items?: T[];
  maxResults?: number;
  size: number;
}

export interface GetResponse {
  self: string;
  expand: string;
}