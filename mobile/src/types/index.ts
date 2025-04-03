export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface Insurance {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
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

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token: string;
  message: string;
}

export interface AdminProfile {
  username: string;
  lastLoginAt?: string;
}

export interface CreateInsuranceRequest {
  name: string;
  description: string;
  isActive: boolean;
}

export interface UpdateInsuranceRequest {
  name: string;
  description: string;
  isActive: boolean;
}

export type RootStackParamList = {
  Home: undefined;
  InsuranceSelection: undefined;
  ApplicationForm: { insurance: Insurance };
  Success: { insuranceName: string };
  AdminLogin: undefined;
  AdminDashboard: undefined;
  AdminInsurances: undefined;
  AdminApplications: undefined;
  AdminInsuranceForm: { insurance?: Insurance };
};