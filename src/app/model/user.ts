export interface User {
  userId: number;
  name: string;
  email: string;
  profilePicturePath?: string;
  roles: string[];
}

export interface UserProfile {
  userId: number;
  name: string;
  email: string;
  profilePicturePath?: string;
  roles: string[];
}

export interface UserReference {
  userId: number;
  email: string;
  name: string;
  profilePicturePath?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  name: string;
  email: string;
  userRoles: number[];
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  password?: string;
  newPassword?: string;
  picture?: File;
}

export interface VerifyCodeResponse {
  resetToken: string;
}

export interface UserPage {
  users: User[];
  totalElements: number;
  totalPages: number;
}