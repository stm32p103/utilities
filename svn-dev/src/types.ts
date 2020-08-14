export type SvnLogPathKind = 'dir'     /// directory
                           | 'file';   /// file

export type SvnLogPathAction = 'A'     /// added 
                             | 'D'     /// deleted
                             | 'R'     /// replaced
                             | 'M';    /// modified

