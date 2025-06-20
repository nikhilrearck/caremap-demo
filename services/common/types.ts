export type AuthTokens = {
  access_token?: string;
  refresh_token?: string;
  issued_at?: string;
  expires_in?: string;
};

export type GoogleConfig = {
  REDIRECT_URI: string,
  GOOGLE_IOS_CLIENT_ID: string;
  GOOGLE_ANDROID_CLIENT_ID: string;
}

export type AlertType = 'i' | 'e' | 'w';

export const alertTitleMap: Record<AlertType, string> = {
  i: 'Info',
  e: 'Error',
  w: 'Warning',
};