import apiClient from './client';
import { Address, CreateAddressRequest, UpdateAddressRequest, RootEntity } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

const ADDRESS_API = API_ENDPOINTS.ADDRESS;

const mapBackendAddressToFrontend = (backendAddress: any): Address => ({
  id: backendAddress.id?.toString() || '',
  city: backendAddress.city || '',
  district: backendAddress.district || '',
  neighborhood: backendAddress.neighborhood || '',
  street: backendAddress.street || '',
});

const mapFrontendAddressToBackend = (frontendAddress: CreateAddressRequest | UpdateAddressRequest): any => ({
  id: (frontendAddress as UpdateAddressRequest).id,
  city: frontendAddress.city,
  district: frontendAddress.district,
  neighborhood: frontendAddress.neighborhood,
  street: frontendAddress.street,
});

export const addressesApi = {
  getAll: async (): Promise<Address[]> => {
    // Note: Backend doesn't have list endpoint yet
    throw new Error('List endpoint not implemented in backend yet');
  },

  getById: async (id: string): Promise<Address> => {
    // Note: Backend doesn't have getById endpoint yet
    throw new Error('GetById endpoint not implemented in backend yet');
  },

  create: async (data: CreateAddressRequest): Promise<Address> => {
    const backendData = mapFrontendAddressToBackend(data);
    const response = await apiClient.post<RootEntity<any>>(`${ADDRESS_API}/save`, backendData);
    return mapBackendAddressToFrontend(response.data.payload);
  },

  update: async (id: string, data: UpdateAddressRequest): Promise<Address> => {
    const backendData = mapFrontendAddressToBackend({ ...data, id });
    const response = await apiClient.post<RootEntity<any>>(`${ADDRESS_API}/save`, backendData);
    return mapBackendAddressToFrontend(response.data.payload);
  },

  delete: async (id: string): Promise<void> => {
    // Note: Backend doesn't have delete endpoint yet
    throw new Error('Delete endpoint not implemented in backend yet');
  },
};
