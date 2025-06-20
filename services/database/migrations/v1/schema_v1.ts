export interface User {
  id: string;
  name: string;
  email: string;
  profile_picture_url: string;
};

export interface Patient {
  id: number;
  user_id: string;
  name: string;
  age?: number;
  relationship?: string;
  weight?: number;
  height?: number;
  gender?: string;
  birthdate?: string;
}

export const tables = {
  USER: 'users',
  PATIENT: 'patients',
}