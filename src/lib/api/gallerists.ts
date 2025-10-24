import apiClient from './client';
import { Gallerist, CreateGalleristRequest, UpdateGalleristRequest, GalleristWithAddressInput, RootEntity } from '../types';
import { API_ENDPOINTS } from '../utils/constants';
import { addressesApi } from './addresses';

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
  firstName: frontendGallerist.firstName,
  lastName: frontendGallerist.lastName,
  addressId: Number(frontendGallerist.addressId),
});

export const galleristsApi = {
  getAll: async (): Promise<Gallerist[]> => {
    const response = await apiClient.get<RootEntity<any[]>>(`${GALLERIST_API}/list`);
    return response.data.payload.map(mapBackendGalleristToFrontend);
  },

  getById: async (id: string): Promise<Gallerist> => {
    // Note: Backend doesn't have getById endpoint, using list and filter
    const gallerists = await galleristsApi.getAll();
    const gallerist = gallerists.find(g => g.id === id);
    if (!gallerist) throw new Error('Gallerist not found');
    return gallerist;
  },

  create: async (data: CreateGalleristRequest): Promise<Gallerist> => {
    const backendData = mapFrontendGalleristToBackend(data);
    const response = await apiClient.post<RootEntity<any>>(`${GALLERIST_API}/save`, backendData);
    return mapBackendGalleristToFrontend(response.data.payload);
  },

  update: async (id: string, data: UpdateGalleristRequest): Promise<Gallerist> => {
    const backendData = mapFrontendGalleristToBackend(data);
    const response = await apiClient.put<RootEntity<any>>(`${GALLERIST_API}/update/${id}`, backendData);
    return mapBackendGalleristToFrontend(response.data.payload);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${GALLERIST_API}/delete/${id}`);
  },

  // Helper: Create gallerist with address in one step
  createWithAddress: async (data: GalleristWithAddressInput): Promise<Gallerist> => {
    // First create the address
    const address = await addressesApi.create(data.address);
    
    // Then create the gallerist with the address ID
    return galleristsApi.create({
      firstName: data.firstName,
      lastName: data.lastName,
      addressId: address.id,
    });
  },

  // Helper: Update gallerist with address
  updateWithAddress: async (id: string, data: GalleristWithAddressInput & { addressId?: string }): Promise<Gallerist> => {
    let addressId = data.addressId;
    
    // If no addressId provided, create new address
    if (!addressId) {
      const address = await addressesApi.create(data.address);
      addressId = address.id;
    }
    
    return galleristsApi.update(id, {
      id: id,
      firstName: data.firstName,
      lastName: data.lastName,
      addressId: addressId,
    });
  },
};
