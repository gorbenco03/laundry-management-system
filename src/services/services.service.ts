import api from './api';
import { Service } from '../types';

interface ServicesResponse {
  success: boolean;
  data: Service[];
}

interface ServiceResponse {
  success: boolean;
  data: Service;
}

class ServicesService {
  // Obține toate serviciile
  async getServices(params?: {
    category?: string;
    isActive?: boolean;
  }): Promise<Service[]> {
    const response = await api.get<ServicesResponse>('/services', { params });
    return response.data.data;
  }

  // Obține serviciu după ID
  async getServiceById(id: string): Promise<Service> {
    const response = await api.get<ServiceResponse>(`/services/${id}`);
    return response.data.data;
  }

  // Obține serviciu după cod
  async getServiceByCode(code: string): Promise<Service> {
    const response = await api.get<ServiceResponse>(`/services/code/${code}`);
    return response.data.data;
  }

  // Cache local pentru servicii (pentru a evita request-uri multiple)
  private servicesCache: Service[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minute

  async getCachedServices(): Promise<Service[]> {
    const now = Date.now();
    
    if (this.servicesCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.servicesCache;
    }

    const services = await this.getServices({ isActive: true });
    this.servicesCache = services;
    this.cacheTimestamp = now;
    
    return services;
  }

  clearCache(): void {
    this.servicesCache = null;
    this.cacheTimestamp = 0;
  }
}

export default new ServicesService();