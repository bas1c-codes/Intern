import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn('NEXT_PUBLIC_API_URL environment variable is not set');
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export interface LeadRequest {
  name: string;
  phone: number;
  city: string;
  service: 'Service 1' | 'Service 2' | 'Service 3';
  description: string;
}

export interface Provider {
  id: string;
  providerCode: number;
  name: string;
  quota: number;
}

export interface AssignedLead {
  id: string;
  lead: LeadRequest;
  provider: Provider;
}

export interface DashboardItem {
  provider: Provider;
  remainingQuota: number;
  leadCount: number;
  assignedLeads: AssignedLead[];
}

export const apiService = {
  // Create a new lead
  createLead: async (data: LeadRequest) => {
    return api.post('/request-service', data);
  },

  // Get dashboard data
  getDashboard: async () => {
    return api.post<DashboardItem[]>('/dashboard');
  },

  // Generate test leads
  generateTestLeads: async () => {
    return api.post('/test-tools/generate');
  },

  // Reset quota
  resetQuota: async (eventId: string) => {
    return api.post(`/webhook/reset-quota?eventId=${eventId}`);
  },
};
