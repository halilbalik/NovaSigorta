// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// Insurance Types
export interface Insurance {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Application Types
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

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  InsuranceSelection: undefined;
  ApplicationForm: { insurance: Insurance };
  Success: { insuranceName: string };
};