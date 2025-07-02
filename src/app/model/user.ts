export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
