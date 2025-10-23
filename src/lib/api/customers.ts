import apiClient from './client';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest, RootEntity } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

const CUSTOMER_API = API_ENDPOINTS.CUSTOMER;

const mapBackendCustomerToFrontend = (backendCustomer: any): Customer => ({
  id: backendCustomer.id?.toString() || '',
  firstName: backendCustomer.firstName || '',
  lastName: backendCustomer.lastName || '',
  tckn: backendCustomer.tckn || '',
  birthDate: backendCustomer.birthDate || '',
  address: backendCustomer.address ? {
    id: backendCustomer.address.id?.toString() || '',
    city: backendCustomer.address.city || '',
    district: backendCustomer.address.district || '',
    neighborhood: backendCustomer.address.neighborhood || '',
    street: backendCustomer.address.street || '',
  } : undefined,
  account: backendCustomer.account ? {
    id: backendCustomer.account.id?.toString() || '',
    accountNo: backendCustomer.account.accountNo || '',
    iban: backendCustomer.account.iban || '',
    amount: backendCustomer.account.amount || 0,
    currencyType: backendCustomer.account.currencyType || 'TRY',
  } : undefined,
  createdAt: backendCustomer.createTime,
  updatedAt: backendCustomer.createTime,
});

const mapFrontendCustomerToBackend = (frontendCustomer: CreateCustomerRequest | UpdateCustomerRequest): any => ({
  id: (frontendCustomer as UpdateCustomerRequest).id,
  firstName: frontendCustomer.firstName,
  lastName: frontendCustomer.lastName,
  tckn: frontendCustomer.tckn,
  birthDate: frontendCustomer.birthDate,
  address: frontendCustomer.address ? {
    id: frontendCustomer.address.id,
    city: frontendCustomer.address.city,
    district: frontendCustomer.address.district,
    neighborhood: frontendCustomer.address.neighborhood,
    street: frontendCustomer.address.street,
  } : undefined,
  account: frontendCustomer.account ? {
    id: frontendCustomer.account.id,
    accountNo: frontendCustomer.account.accountNo,
    iban: frontendCustomer.account.iban,
    amount: frontendCustomer.account.amount,
    currencyType: frontendCustomer.account.currencyType,
  } : undefined,
});

export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    // Note: Backend doesn't have list endpoint yet
    throw new Error('List endpoint not implemented in backend yet');
  },

  getById: async (id: string): Promise<Customer> => {
    // Note: Backend doesn't have getById endpoint yet
    throw new Error('GetById endpoint not implemented in backend yet');
  },

  create: async (data: CreateCustomerRequest): Promise<Customer> => {
    const backendData = mapFrontendCustomerToBackend(data);
    const response = await apiClient.post<RootEntity<any>>(`${CUSTOMER_API}/save`, backendData);
    return mapBackendCustomerToFrontend(response.data.payload);
  },

  update: async (id: string, data: UpdateCustomerRequest): Promise<Customer> => {
    const backendData = mapFrontendCustomerToBackend({ ...data, id });
    const response = await apiClient.post<RootEntity<any>>(`${CUSTOMER_API}/save`, backendData);
    return mapBackendCustomerToFrontend(response.data.payload);
  },

  delete: async (id: string): Promise<void> => {
    // Note: Backend doesn't have delete endpoint yet
    throw new Error('Delete endpoint not implemented in backend yet');
  },
};
