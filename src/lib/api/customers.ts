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
    createdAt: backendCustomer.address.createTime,
    updatedAt: backendCustomer.address.updateTime,
  } : undefined,
  account: backendCustomer.account ? {
    id: backendCustomer.account.id?.toString() || '',
    accountNo: backendCustomer.account.accountNo || '',
    iban: backendCustomer.account.iban || '',
    amount: backendCustomer.account.amount || 0,
    currencyType: backendCustomer.account.currencyType || 'TL',
    createdAt: backendCustomer.account.createTime,
    updatedAt: backendCustomer.account.updateTime,
  } : undefined,
  createdAt: backendCustomer.createTime,
  updatedAt: backendCustomer.updateTime,
});

const mapFrontendCustomerToBackend = (frontendCustomer: CreateCustomerRequest | UpdateCustomerRequest): any => ({
  firstName: frontendCustomer.firstName,
  lastName: frontendCustomer.lastName,
  tckn: frontendCustomer.tckn,
  birthDate: frontendCustomer.birthDate,
  addressId: parseInt(frontendCustomer.addressId),
  accountId: parseInt(frontendCustomer.accountId),
});

export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    const response = await apiClient.get<RootEntity<any[]>>(`${CUSTOMER_API}/list`);
    return response.data.payload.map(mapBackendCustomerToFrontend);
  },

  getById: async (id: string): Promise<Customer> => {
    // Backend doesn't have getById, so we'll fetch all and find the one we need
    const customers = await customersApi.getAll();
    const found = customers.find((c) => c.id === id);
    if (!found) throw new Error('Customer not found');
    return found;
  },

  create: async (data: CreateCustomerRequest): Promise<Customer> => {
    const backendData = mapFrontendCustomerToBackend(data);
    const response = await apiClient.post<RootEntity<any>>(`${CUSTOMER_API}/save`, backendData);
    return mapBackendCustomerToFrontend(response.data.payload);
  },

  update: async (id: string, data: UpdateCustomerRequest): Promise<Customer> => {
    const backendData = mapFrontendCustomerToBackend(data);
    const response = await apiClient.put<RootEntity<any>>(`${CUSTOMER_API}/update/${id}`, backendData);
    return mapBackendCustomerToFrontend(response.data.payload);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<RootEntity<string>>(`${CUSTOMER_API}/delete/${id}`);
  },
};
