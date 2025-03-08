import axios, { AxiosInstance } from 'axios';
import {
  ApiResponse,
  Insurance,
  Application,
  CreateApplicationRequest,
} from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    // Backend API URL - Windows localhost
    const baseURL = 'http://10.0.2.2:5260/api'; // Android emulator
    // const baseURL = 'http://localhost:5260/api'; // iOS simulator

    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor - Hata yönetimi
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // Public endpoints (no auth required)
  async getActiveInsurances(): Promise<ApiResponse<Insurance[]>> {
    const { data } = await this.client.get<ApiResponse<Insurance[]>>('/public/insurances');
    return data;
  }

  async createApplication(application: CreateApplicationRequest): Promise<ApiResponse<Application>> {
    const { data } = await this.client.post<ApiResponse<Application>>('/public/applications', application);
    return data;
  }
}

export const apiService = new ApiService();
