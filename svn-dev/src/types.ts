export type SvnLogPathKind = 'dir'     /// directory
                           | 'file';   /// file

export type SvnLogPathAction = 'A'     /// added 
                             | 'D'     /// deleted
                             | 'R'     /// replaced
                             | 'M';    /// modified

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
