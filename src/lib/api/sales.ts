import apiClient from './client';
import { Sale, CreateSaleRequest, UpdateSaleRequest, RootEntity } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

const SALED_CAR_API = API_ENDPOINTS.SALED_CAR;

const mapBackendSaleToFrontend = (backendSale: any): Sale => ({
  id: backendSale.id?.toString() || '',
  customer: backendSale.customer ? {
    id: backendSale.customer.id?.toString() || '',
    firstName: backendSale.customer.firstName || '',
    lastName: backendSale.customer.lastName || '',
    tckn: backendSale.customer.tckn || '',
    birthDate: backendSale.customer.birthDate || '',
    address: backendSale.customer.address,
    account: backendSale.customer.account,
  } : undefined,
  gallerist: backendSale.gallerist ? {
    id: backendSale.gallerist.id?.toString() || '',
    firstName: backendSale.gallerist.firstName || '',
    lastName: backendSale.gallerist.lastName || '',
    address: backendSale.gallerist.address,
  } : undefined,
  car: backendSale.car ? {
    id: backendSale.car.id?.toString() || '',
    plate: backendSale.car.plaka || '', // plaka → plate
    brand: backendSale.car.brand || '',
    model: backendSale.car.model || '',
    productionYear: backendSale.car.productionYear || 0,
    price: backendSale.car.price || 0,
    currencyType: backendSale.car.currencyType || 'TRY',
    damagePrice: backendSale.car.damagePrice,
    carStatusType: backendSale.car.carStatusType || 'SOLD',
  } : undefined,
  saleDate: backendSale.createTime,
  createdAt: backendSale.createTime,
  updatedAt: backendSale.createTime,
});

const mapFrontendSaleToBackend = (frontendSale: CreateSaleRequest | UpdateSaleRequest): any => ({
  id: (frontendSale as UpdateSaleRequest).id,
  customer: frontendSale.customer ? {
    id: frontendSale.customer.id,
  } : undefined,
  gallerist: frontendSale.gallerist ? {
    id: frontendSale.gallerist.id,
  } : undefined,
  car: frontendSale.car ? {
    id: frontendSale.car.id,
  } : undefined,
});

export const salesApi = {
  getAll: async (): Promise<Sale[]> => {
    // Note: Backend doesn't have list endpoint yet
    throw new Error('List endpoint not implemented in backend yet');
  },

  getById: async (id: string): Promise<Sale> => {
    // Note: Backend doesn't have getById endpoint yet
    throw new Error('GetById endpoint not implemented in backend yet');
  },

  create: async (data: CreateSaleRequest): Promise<Sale> => {
    const backendData = mapFrontendSaleToBackend(data);
    const response = await apiClient.post<RootEntity<any>>(`${SALED_CAR_API}/save`, backendData);
    return mapBackendSaleToFrontend(response.data.payload);
  },

  update: async (id: string, data: UpdateSaleRequest): Promise<Sale> => {
    const backendData = mapFrontendSaleToBackend({ ...data, id });
    const response = await apiClient.post<RootEntity<any>>(`${SALED_CAR_API}/save`, backendData);
    return mapBackendSaleToFrontend(response.data.payload);
  },

  delete: async (id: string): Promise<void> => {
    // Note: Backend doesn't have delete endpoint yet
    throw new Error('Delete endpoint not implemented in backend yet');
  },
};
