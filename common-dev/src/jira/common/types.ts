export interface SimpleListWrapper<T> {
  items?: T[];
  maxResults?: number;
  size: number;
}

export type ResponseOf<T> = T & {
  self: string;
  expand?: string;
};

export type RequiresKey<T, K extends keyof T> = Required<Pick<T, K>> & Exclude<T,K>;
