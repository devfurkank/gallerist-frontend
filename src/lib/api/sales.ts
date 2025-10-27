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
    plate: backendSale.car.plaka || '',
    brand: backendSale.car.brand || '',
    model: backendSale.car.model || '',
    productionYear: backendSale.car.productionYear || 0,
    price: backendSale.car.price || 0,
    currencyType: backendSale.car.currencyType || 'TRY',
    damagePrice: backendSale.car.damagePrice,
    carStatusType: backendSale.car.carStatusType || 'SALED',
  } : undefined,
  createTime: backendSale.createTime,
  updatedAt: backendSale.createTime,
});

const mapFrontendSaleToBackend = (frontendSale: CreateSaleRequest | UpdateSaleRequest): any => ({
  customerId: frontendSale.customerId,
  galleristId: frontendSale.galleristId,
  carId: frontendSale.carId,
});

export const salesApi = {
  getAll: async (): Promise<Sale[]> => {
    const response = await apiClient.get<RootEntity<any[]>>(`${SALED_CAR_API}/list`);
    return response.data.payload.map(mapBackendSaleToFrontend);
  },

  getById: async (id: string): Promise<Sale> => {
    // Backend doesn't have getById endpoint, so we get all and filter
    const response = await apiClient.get<RootEntity<any[]>>(`${SALED_CAR_API}/list`);
    const sale = response.data.payload.find((s: any) => s.id?.toString() === id);
    if (!sale) {
      throw new Error('Sale not found');
    }
    return mapBackendSaleToFrontend(sale);
  },

  create: async (data: CreateSaleRequest): Promise<Sale> => {
    const backendData = mapFrontendSaleToBackend(data);
    const response = await apiClient.post<RootEntity<any>>(`${SALED_CAR_API}/save`, backendData);
    return mapBackendSaleToFrontend(response.data.payload);
  },

  update: async (id: string, data: UpdateSaleRequest): Promise<Sale> => {
    const backendData = mapFrontendSaleToBackend(data);
    const response = await apiClient.put<RootEntity<any>>(`${SALED_CAR_API}/update/${id}`, backendData);
    return mapBackendSaleToFrontend(response.data.payload);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<RootEntity<string>>(`${SALED_CAR_API}/delete/${id}`);
  },
};
