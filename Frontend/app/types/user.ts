export type UserRole = 'admin' | 'employee' | 'user';

export interface User {
  id: number;
  name: string;
  phone: string;
  role: UserRole;
  book?: string;
  qty?: number;
  discount?: number;
  total?: number;
  payment?: string;
  address?: string;
  date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserPayload {
  name: string;
  phone: string;
  password?: string;
  role: UserRole;
  book?: string;
  qty?: number;
  discount?: number;
  total?: number;
  payment?: string;
  address?: string;
}

export type UpdateUserPayload = Partial<CreateUserPayload>
