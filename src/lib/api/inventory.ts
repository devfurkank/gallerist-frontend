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
    address: backendInventory.gallerist.address,
  } : undefined,
  car: backendInventory.car ? {
    id: backendInventory.car.id?.toString() || '',
    plate: backendInventory.car.plaka || '', // plaka → plate
    brand: backendInventory.car.brand || '',
    model: backendInventory.car.model || '',
    productionYear: backendInventory.car.productionYear || 0,
    price: backendInventory.car.price || 0,
    currencyType: backendInventory.car.currencyType || 'TRY',
    damagePrice: backendInventory.car.damagePrice,
    carStatusType: backendInventory.car.carStatusType || 'SALABLE',
  } : undefined,
  createdAt: backendInventory.createTime,
  updatedAt: backendInventory.createTime,
});

const mapFrontendInventoryToBackend = (frontendInventory: CreateGalleristCarRequest | UpdateGalleristCarRequest): any => ({
  id: (frontendInventory as UpdateGalleristCarRequest).id,
  gallerist: frontendInventory.gallerist ? {
    id: frontendInventory.gallerist.id,
  } : undefined,
  car: frontendInventory.car ? {
    id: frontendInventory.car.id,
  } : undefined,
});

export const inventoryApi = {
  getAll: async (): Promise<GalleristCar[]> => {
    // Note: Backend doesn't have list endpoint yet
    throw new Error('List endpoint not implemented in backend yet');
  },

  getById: async (id: string): Promise<GalleristCar> => {
    // Note: Backend doesn't have getById endpoint yet
    throw new Error('GetById endpoint not implemented in backend yet');
  },

  create: async (data: CreateGalleristCarRequest): Promise<GalleristCar> => {
    const backendData = mapFrontendInventoryToBackend(data);
    const response = await apiClient.post<RootEntity<any>>(`${GALLERIST_CAR_API}/save`, backendData);
    return mapBackendInventoryToFrontend(response.data.payload);
  },

  update: async (id: string, data: UpdateGalleristCarRequest): Promise<GalleristCar> => {
    const backendData = mapFrontendInventoryToBackend({ ...data, id });
    const response = await apiClient.post<RootEntity<any>>(`${GALLERIST_CAR_API}/save`, backendData);
    return mapBackendInventoryToFrontend(response.data.payload);
  },

  delete: async (id: string): Promise<void> => {
    // Note: Backend doesn't have delete endpoint yet
    throw new Error('Delete endpoint not implemented in backend yet');
  },
};
