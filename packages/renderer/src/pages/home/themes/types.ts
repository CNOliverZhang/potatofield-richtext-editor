export enum ThemeType {
  PRESET = 1,
  ONLINE = 2,
  CUSTOM = 2,
}

export interface ThemeWithTypeInfo extends Theme {
  type: ThemeType;
}
