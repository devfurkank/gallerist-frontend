import apiClient from './client';
import { GalleristCar, CreateGalleristCarRequest, UpdateGalleristCarRequest, RootEntity } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

const GALLERIST_CAR_API = API_ENDPOINTS.GALLERIST_CAR;

const mapBackendInventoryToFrontend = (backendInventory: any): GalleristCar => ({
  id: backendInventory.id?.toString() || '',
  gallerist: backendInventory.gallerist ? {
    id: backendInventory.gallerist.id?.toString() || '',
    firstName: backendInventory.gallerist.firstName || '',
    lastName: backendInventory.gallerist.lastName || '',
    address: backendInventory.gallerist.address ? {
      id: backendInventory.gallerist.address.id?.toString() || '',
      city: backendInventory.gallerist.address.city || '',
      district: backendInventory.gallerist.address.district || '',
      neighborhood: backendInventory.gallerist.address.neighborhood || '',
      street: backendInventory.gallerist.address.street || '',
      postalCode: backendInventory.gallerist.address.postalCode || '',
    } : undefined,
  } : {} as any,
  car: backendInventory.car ? {
    id: backendInventory.car.id?.toString() || '',
    plate: backendInventory.car.plaka || '', // plaka → plate
    brand: backendInventory.car.brand || '',
    model: backendInventory.car.model || '',
    productionYear: backendInventory.car.productionYear || 0,
    price: backendInventory.car.price || 0,
    currencyType: backendInventory.car.currencyType || 'TRY',
    damagePrice: backendInventory.car.damagePrice || 0,
    carStatusType: backendInventory.car.carStatusType || 'SALABLE',
  } : {} as any,
  createTime: backendInventory.createTime,
});

const mapFrontendInventoryToBackend = (data: CreateGalleristCarRequest | UpdateGalleristCarRequest): any => ({
  galleristId: data.galleristId,
  carId: data.carId,
});

export const inventoryApi = {
  getAll: async (): Promise<GalleristCar[]> => {
    const response = await apiClient.get<RootEntity<any[]>>(`${GALLERIST_CAR_API}/list`);
    return response.data.payload.map(mapBackendInventoryToFrontend);
  },

  create: async (data: CreateGalleristCarRequest): Promise<GalleristCar> => {
    const backendData = mapFrontendInventoryToBackend(data);
    const response = await apiClient.post<RootEntity<any>>(`${GALLERIST_CAR_API}/save`, backendData);
    return mapBackendInventoryToFrontend(response.data.payload);
  },

  update: async (id: string, data: UpdateGalleristCarRequest): Promise<GalleristCar> => {
    const backendData = mapFrontendInventoryToBackend(data);
    const response = await apiClient.put<RootEntity<any>>(`${GALLERIST_CAR_API}/update/${id}`, backendData);
    return mapBackendInventoryToFrontend(response.data.payload);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<RootEntity<string>>(`${GALLERIST_CAR_API}/delete/${id}`);
  },
};
