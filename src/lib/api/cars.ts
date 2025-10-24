import apiClient from './client';
import { Car, CreateCarRequest, UpdateCarRequest, RootEntity } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

const CAR_API = API_ENDPOINTS.CAR;

// Backend field name mappings
const mapBackendCarToFrontend = (backendCar: any): Car => ({
  id: backendCar.id?.toString() || '',
  plate: backendCar.plaka || '', // plaka → plate
  brand: backendCar.brand || '',
  model: backendCar.model || '',
  productionYear: backendCar.productionYear || 0,
  price: backendCar.price || 0,
  currencyType: backendCar.currencyType || 'TL',
  damagePrice: backendCar.damagePrice,
  carStatusType: backendCar.carStatusType || 'SALABLE',
  createdAt: backendCar.createTime, // createTime → createdAt
  updatedAt: backendCar.createTime,
});

const mapFrontendCarToBackend = (frontendCar: CreateCarRequest | UpdateCarRequest): any => ({
  id: (frontendCar as UpdateCarRequest).id,
  plaka: frontendCar.plate, // plate → plaka
  brand: frontendCar.brand,
  model: frontendCar.model,
  productionYear: frontendCar.productionYear,
  price: frontendCar.price,
  currencyType: frontendCar.currencyType,
  damagePrice: frontendCar.damagePrice,
  carStatusType: frontendCar.carStatusType,
});

export const carsApi = {
  getAll: async (): Promise<Car[]> => {
    const response = await apiClient.get<RootEntity<any[]>>(`${CAR_API}/list`);
    return response.data.payload.map(mapBackendCarToFrontend);
  },

  getById: async (id: string): Promise<Car> => {
    // Note: Backend doesn't have getById endpoint, using list and filter
    const cars = await carsApi.getAll();
    const car = cars.find(c => c.id === id);
    if (!car) throw new Error('Car not found');
    return car;
  },

  create: async (data: CreateCarRequest): Promise<Car> => {
    const backendData = mapFrontendCarToBackend(data);
    const response = await apiClient.post<RootEntity<any>>(`${CAR_API}/save`, backendData);
    return mapBackendCarToFrontend(response.data.payload);
  },

  update: async (id: string, data: UpdateCarRequest): Promise<Car> => {
    const backendData = mapFrontendCarToBackend(data);
    const response = await apiClient.put<RootEntity<any>>(`${CAR_API}/update/${id}`, backendData);
    return mapBackendCarToFrontend(response.data.payload);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${CAR_API}/delete/${id}`);
  },
};
