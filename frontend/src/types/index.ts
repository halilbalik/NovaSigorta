export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  message: string;
}

export interface AdminProfile {
  id: number;
  username: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Insurance {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateInsuranceRequest {
  name: string;
  description: string;
}

export interface UpdateInsuranceRequest {
  name: string;
  description: string;
}

export interface Application {
  id: number;
  insuranceId: number;
  insuranceName: string;
  selectedDate: string;
  phone: string;
  createdAt: string;
}

export interface CreateApplicationRequest {
  insuranceId: number;
  selectedDate: string;
  phone: string;
}

export interface AuthState {
  token: string | null;
  admin: AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}
