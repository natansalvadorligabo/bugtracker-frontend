export interface UserRegister {
  name: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  roles: string[];
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  profilePicture: File | null;
  authorities: Authority[];
  enabled: boolean;
}

export interface Authority {
  authority: string;
}
