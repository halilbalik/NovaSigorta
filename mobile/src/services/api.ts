import axios, { AxiosInstance } from 'axios';
import {
  ApiResponse,
  Insurance,
  Application,
  CreateApplicationRequest,
  AdminLoginRequest,
  AdminLoginResponse,
  AdminProfile,
  CreateInsuranceRequest,
  UpdateInsuranceRequest,
} from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    const baseURL = 'http://10.0.2.2:5260/api';

    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  async getActiveInsurances(): Promise<ApiResponse<Insurance[]>> {
    const { data } = await this.client.get<ApiResponse<Insurance[]>>('/public/insurances');
    return data;
  }

  async createApplication(application: CreateApplicationRequest): Promise<ApiResponse<Application>> {
    const { data } = await this.client.post<ApiResponse<Application>>('/public/applications', application);
    return data;
  }

  private getAuthHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async adminLogin(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    const { data } = await this.client.post<AdminLoginResponse>('/admin/login', credentials);
    return data;
  }

  async getAdminProfile(token: string): Promise<AdminProfile> {
    const { data } = await this.client.get<AdminProfile>('/admin/profile', {
      headers: this.getAuthHeaders(token),
    });
    return data;
  }

  async getAllInsurances(token: string): Promise<ApiResponse<Insurance[]>> {
    const { data } = await this.client.get<ApiResponse<Insurance[]>>('/admin/insurances', {
      headers: this.getAuthHeaders(token),
    });
    return data;
  }

  async createInsurance(token: string, insurance: CreateInsuranceRequest): Promise<ApiResponse<Insurance>> {
    const { data } = await this.client.post<ApiResponse<Insurance>>('/admin/insurances', insurance, {
      headers: this.getAuthHeaders(token),
    });
    return data;
  }

  async updateInsurance(token: string, id: number, insurance: UpdateInsuranceRequest): Promise<ApiResponse<Insurance>> {
    const { data } = await this.client.put<ApiResponse<Insurance>>(`/admin/insurances/${id}`, insurance, {
      headers: this.getAuthHeaders(token),
    });
    return data;
  }

  async deleteInsurance(token: string, id: number): Promise<ApiResponse<null>> {
    const { data } = await this.client.delete<ApiResponse<null>>(`/admin/insurances/${id}`, {
      headers: this.getAuthHeaders(token),
    });
    return data;
  }

  async toggleInsuranceStatus(token: string, id: number): Promise<ApiResponse<Insurance>> {
    const { data } = await this.client.patch<ApiResponse<Insurance>>(`/admin/insurances/${id}/toggle`, {}, {
      headers: this.getAuthHeaders(token),
    });
    return data;
  }

  async getAllApplications(token: string): Promise<ApiResponse<Application[]>> {
    const { data } = await this.client.get<ApiResponse<Application[]>>('/admin/applications', {
      headers: this.getAuthHeaders(token),
    });
    return data;
  }
}

export const apiService = new ApiService();

export const adminApi = {
  login: (username: string, password: string) =>
    apiService.adminLogin({ username, password }),
  getProfile: (token: string) =>
    apiService.getAdminProfile(token),
  getAllInsurances: (token: string) =>
    apiService.getAllInsurances(token),
  createInsurance: (token: string, insurance: CreateInsuranceRequest) =>
    apiService.createInsurance(token, insurance),
  updateInsurance: (token: string, id: number, insurance: UpdateInsuranceRequest) =>
    apiService.updateInsurance(token, id, insurance),
  deleteInsurance: (token: string, id: number) =>
    apiService.deleteInsurance(token, id),
  toggleInsuranceStatus: (token: string, id: number) =>
    apiService.toggleInsuranceStatus(token, id),
  getAllApplications: (token: string) =>
    apiService.getAllApplications(token),
};
