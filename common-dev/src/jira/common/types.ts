

export interface SimpleListWrapper<T> {
  items?: T[];
  maxResults?: number;
  size: number;
}

export interface PagenatedList<T> {
  isLast?:    boolean;
  maxResults: number;
  nextPage?:  string;
  self?:      string;
  startAt:    number;
  total?:     number;
  values?:    T[];
}

export type Expandable<T> = T & { expand: string };

// 指定したキーが必須
export type RequiresKey<T, K extends keyof T> = Required<Pick<T, K>> & Exclude<T,K>;

/* ----------------------------------------------------------------------------
  U = { [ K in keyof T ]-?: Pick<T,K> } 
    = { a: Pick<T,a>, b: Pick<T,b>, c: Pick<T,c> }
  U[ keyof U ] = Pick<T,a> | Pick<T,b> | Pick<T,c>
---------------------------------------------------------------------------- */
// プロパティの内1つは必須
export type RequiresOne<T, U = { [ K in keyof T ]: Pick<T, K> }> = Partial<T> & Required<U[ keyof U ]>;

// 指定したプロパティの内1つは必須
export type RequiresOneKey<T, K extends keyof T> = Omit<T,K> & RequiresOne<Pick<T,K>>;

// 指定したプロパティの内1つは必須、他は不要

// キーの一部
export type SubKeyof<T, K extends keyof T> = keyof Pick<T,K>;

// TのプロパティをRで置き換える
export type Replace<T, R> = Omit<T, keyof R> & R;

// 型を置き換える
export type ReplaceType<T, FROM, TO> = { [K in keyof T]: T[K] extends FROM ? TO : T[K] };


export type SelectProperty<T, Req extends keyof T, Opt extends keyof T = never> = Required<Pick<T,Req>> & Partial<Pick<T,Opt>>;

export function getKeys( obj: { [key: string]: any } ) {
  const arr: string[] = [];
  for( let key in obj ) {
    arr.push( key );
  }
  return arr;
}