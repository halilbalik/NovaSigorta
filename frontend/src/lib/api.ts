import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  AdminProfile,
  Insurance,
  CreateInsuranceRequest,
  UpdateInsuranceRequest,
  Application,
  CreateApplicationRequest,
} from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:5260/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });


    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );


    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }


  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await this.client.post<LoginResponse>('/admin/login', credentials);
    return data;
  }

  async getProfile(): Promise<ApiResponse<AdminProfile>> {
    const { data } = await this.client.get<ApiResponse<AdminProfile>>('/admin/profile');
    return data;
  }


  async getInsurances(): Promise<ApiResponse<Insurance[]>> {
    const { data } = await this.client.get<ApiResponse<Insurance[]>>('/admin/insurances');
    return data;
  }

  async getInsurance(id: number): Promise<ApiResponse<Insurance>> {
    const { data } = await this.client.get<ApiResponse<Insurance>>(`/admin/insurances/${id}`);
    return data;
  }

  async createInsurance(insurance: CreateInsuranceRequest): Promise<ApiResponse<Insurance>> {
    const { data } = await this.client.post<ApiResponse<Insurance>>('/admin/insurances', insurance);
    return data;
  }

  async updateInsurance(id: number, insurance: UpdateInsuranceRequest): Promise<ApiResponse<Insurance>> {
    const { data } = await this.client.put<ApiResponse<Insurance>>(`/admin/insurances/${id}`, insurance);
    return data;
  }

  async deleteInsurance(id: number): Promise<ApiResponse<void>> {
    const { data } = await this.client.delete<ApiResponse<void>>(`/admin/insurances/${id}`);
    return data;
  }

  async toggleInsuranceStatus(id: number): Promise<ApiResponse<void>> {
    const { data } = await this.client.patch<ApiResponse<void>>(`/admin/insurances/${id}/toggle`);
    return data;
  }


  async getApplications(): Promise<ApiResponse<Application[]>> {
    const { data } = await this.client.get<ApiResponse<Application[]>>('/admin/applications');
    return data;
  }

  async getApplication(id: number): Promise<ApiResponse<Application>> {
    const { data } = await this.client.get<ApiResponse<Application>>(`/admin/applications/${id}`);
    return data;
  }

  async getApplicationsByInsurance(insuranceId: number): Promise<ApiResponse<Application[]>> {
    const { data } = await this.client.get<ApiResponse<Application[]>>(`/admin/insurances/${insuranceId}/applications`);
    return data;
  }


  async getActiveInsurances(): Promise<ApiResponse<Insurance[]>> {
    const { data } = await this.client.get<ApiResponse<Insurance[]>>('/public/insurances');
    return data;
  }

  async createPublicApplication(application: CreateApplicationRequest): Promise<ApiResponse<Application>> {
    const { data } = await this.client.post<ApiResponse<Application>>('/public/applications', application);
    return data;
  }
}

export const api = new ApiClient();
