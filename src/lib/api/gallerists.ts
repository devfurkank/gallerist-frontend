import apiClient from './client';
import { Gallerist, CreateGalleristRequest, UpdateGalleristRequest, RootEntity } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

const GALLERIST_API = API_ENDPOINTS.GALLERIST;

const mapBackendGalleristToFrontend = (backendGallerist: any): Gallerist => ({
  id: backendGallerist.id?.toString() || '',
  firstName: backendGallerist.firstName || '',
  lastName: backendGallerist.lastName || '',
  address: backendGallerist.address ? {
    id: backendGallerist.address.id?.toString() || '',
    city: backendGallerist.address.city || '',
    district: backendGallerist.address.district || '',
    neighborhood: backendGallerist.address.neighborhood || '',
    street: backendGallerist.address.street || '',
  } : undefined,
  createdAt: backendGallerist.createTime,
  updatedAt: backendGallerist.createTime,
});

const mapFrontendGalleristToBackend = (frontendGallerist: CreateGalleristRequest | UpdateGalleristRequest): any => ({
  id: (frontendGallerist as UpdateGalleristRequest).id,
  firstName: frontendGallerist.firstName,
  lastName: frontendGallerist.lastName,
  address: frontendGallerist.address ? {
    id: frontendGallerist.address.id,
    city: frontendGallerist.address.city,
    district: frontendGallerist.address.district,
    neighborhood: frontendGallerist.address.neighborhood,
    street: frontendGallerist.address.street,
  } : undefined,
});

export const galleristsApi = {
  getAll: async (): Promise<Gallerist[]> => {
    // Note: Backend doesn't have list endpoint yet
    throw new Error('List endpoint not implemented in backend yet');
  },

  getById: async (id: string): Promise<Gallerist> => {
    // Note: Backend doesn't have getById endpoint yet
    throw new Error('GetById endpoint not implemented in backend yet');
  },

  create: async (data: CreateGalleristRequest): Promise<Gallerist> => {
    const backendData = mapFrontendGalleristToBackend(data);
    const response = await apiClient.post<RootEntity<any>>(`${GALLERIST_API}/save`, backendData);
    return mapBackendGalleristToFrontend(response.data.payload);
  },

  update: async (id: string, data: UpdateGalleristRequest): Promise<Gallerist> => {
    const backendData = mapFrontendGalleristToBackend({ ...data, id });
    const response = await apiClient.post<RootEntity<any>>(`${GALLERIST_API}/save`, backendData);
    return mapBackendGalleristToFrontend(response.data.payload);
  },

  delete: async (id: string): Promise<void> => {
    // Note: Backend doesn't have delete endpoint yet
    throw new Error('Delete endpoint not implemented in backend yet');
  },
};
