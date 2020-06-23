export interface SimpleListWrapper<T> {
  items?: T[];
  maxResults?: number;
  size: number;
}

// 指定したキーが必須
export type RequiresKey<T, K extends keyof T> = Required<Pick<T, K>> & Exclude<T,K>;

/* ----------------------------------------------------------------------------
  U = { [ K in keyof T ]-?: Pick<T,K> } 
    = { a: Pick<T,a>, b: Pick<T,b>, c: Pick<T,c> }
  U[ keyof U ] = Pick<T,a> | Pick<T,b> | Pick<T,c>
---------------------------------------------------------------------------- */
// プロパティの内1つは必須
export type RequiresOne<T, U = { [ K in keyof T ]: Pick<T, K> }> = Partial<T> & Required<U[ keyof U ]>;

// 指定したプロパティの内1つが必須
export type RequiresOneKey<T, K extends keyof T> = Exclude<T,K> & RequiresOne<Pick<T,K>>;
