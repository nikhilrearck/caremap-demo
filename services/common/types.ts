export type UserInfo = {
  name: string;
  email: string;
  picture: string;
};

export type AuthTokens = {
  access_token?: string;
  refresh_token?: string;
  issued_at?: string;
  expires_in?: string;
};