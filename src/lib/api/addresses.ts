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
  createdAt: backendAddress.createdAt,
  updatedAt: backendAddress.updatedAt,
});

const mapFrontendAddressToBackend = (frontendAddress: CreateAddressRequest | UpdateAddressRequest): any => ({
  city: frontendAddress.city,
  district: frontendAddress.district,
  neighborhood: frontendAddress.neighborhood,
  street: frontendAddress.street,
});

export const addressesApi = {
  /**
   * Tüm adresleri getirir
   * Backend endpoint: GET /rest/api/address/list
   */
  getAll: async (): Promise<Address[]> => {
    const response = await apiClient.get<RootEntity<any[]>>(`${ADDRESS_API}/list`);
    return response.data.payload.map(mapBackendAddressToFrontend);
  },

  /**
   * Backend'de getById endpoint'i yok, bu yüzden liste üzerinden filtreleme yapıyoruz
   */
  getById: async (id: string): Promise<Address> => {
    const addresses = await addressesApi.getAll();
    const address = addresses.find(addr => addr.id === id);
    if (!address) {
      throw new Error(`Address with id ${id} not found`);
    }
    return address;
  },

  /**
   * Yeni adres oluşturur
   * Backend endpoint: POST /rest/api/address/save
   */
  create: async (data: CreateAddressRequest): Promise<Address> => {
    const backendData = mapFrontendAddressToBackend(data);
    const response = await apiClient.post<RootEntity<any>>(`${ADDRESS_API}/save`, backendData);
    return mapBackendAddressToFrontend(response.data.payload);
  },

  /**
   * Mevcut adresi günceller
   * Backend endpoint: PUT /rest/api/address/update/{id}
   */
  update: async (id: string, data: UpdateAddressRequest): Promise<Address> => {
    const backendData = mapFrontendAddressToBackend(data);
    const response = await apiClient.put<RootEntity<any>>(`${ADDRESS_API}/update/${id}`, backendData);
    return mapBackendAddressToFrontend(response.data.payload);
  },

  /**
   * Adresi siler
   * Backend endpoint: DELETE /rest/api/address/delete/{id}
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete<RootEntity<string>>(`${ADDRESS_API}/delete/${id}`);
  },
};
