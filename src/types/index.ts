export type TrackLogo = {
  type: string;
  data: number[];
} | null;

export type Track = {
  _id: number;
  name: string;
  author: string;
  release_date: string;
  genre: string[];
  duration_in_seconds: number;
  album: string;
  logo: TrackLogo;
  track_file: string;
  staredUser?: number[];
};

export type Selection = {
  _id: number;
  name?: string;
  items: number[];
  owner: number[];
  __v: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type Tokens = {
  access: string;
  refresh: string;
};

export type User = {
  _id: number;
  username: string;
  email: string;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type SignupCredentials = AuthCredentials & {
  username: string;
};
