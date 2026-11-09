export interface Role {
  id_role: number;
  name: 'administrator' | 'employee';
}

export interface User {
  id_user: number;
  id_role: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at?: string;
  role?: Role;
}

export interface LoginCredentials {
  email: string;
  password_hash: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}