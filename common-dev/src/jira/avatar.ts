export type AvatarType = 'system' | 'custom';
export type AvatarList = { [P in AvatarType]?: Avatar[] };

export type AvatarSize = '48x48' | '32x32' | '24x24' | '16x16';
export type AvatarUrls = { [P in AvatarSize]?: string };

export interface Avatar {
  id?:            string;
  isDeletable:    boolean;
  isSelected:     boolean;
  isSystemAvatar: boolean;
  owner?:         string;
  selected:       boolean;
  urls?:          AvatarUrls;
}

export interface AvaterCropping {
  cropperOffsetX: number;   // left
  cropperOffsetY: number;   // top
  cropperWidth:   number;   // radius of avatar
  needsCropping:  boolean;
}
