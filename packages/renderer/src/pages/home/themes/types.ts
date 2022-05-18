export enum ThemeType {
  PRESET = 1,
  ONLINE = 2,
  CUSTOM = 3,
}

export interface ThemeWithTypeInfo extends Theme {
  type: ThemeType;
}
