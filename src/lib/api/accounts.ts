import apiClient from './client';
import { Account, CreateAccountRequest, UpdateAccountRequest, RootEntity } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

const ACCOUNT_API = API_ENDPOINTS.ACCOUNT;

const mapBackendAccountToFrontend = (backendAccount: any): Account => ({
  id: backendAccount.id?.toString() || '',
  accountNo: backendAccount.accountNo || '',
  iban: backendAccount.iban || '',
  amount: backendAccount.amount || 0,
  currencyType: backendAccount.currencyType || 'TL',
  createdAt: backendAccount.createTime,
  updatedAt: backendAccount.updateTime,
});

const mapFrontendAccountToBackend = (frontendAccount: CreateAccountRequest | UpdateAccountRequest): any => ({
  accountNo: frontendAccount.accountNo,
  iban: frontendAccount.iban,
  amount: frontendAccount.amount,
  currencyType: frontendAccount.currencyType,
});

export const accountsApi = {
  getAll: async (): Promise<Account[]> => {
    const response = await apiClient.get<RootEntity<any[]>>(`${ACCOUNT_API}/list`);
    return response.data.payload.map(mapBackendAccountToFrontend);
  },

  create: async (data: CreateAccountRequest): Promise<Account> => {
    const backendData = mapFrontendAccountToBackend(data);
    const response = await apiClient.post<RootEntity<any>>(`${ACCOUNT_API}/save`, backendData);
    return mapBackendAccountToFrontend(response.data.payload);
  },

  update: async (id: string, data: UpdateAccountRequest): Promise<Account> => {
    const backendData = mapFrontendAccountToBackend(data);
    const response = await apiClient.put<RootEntity<any>>(`${ACCOUNT_API}/update/${id}`, backendData);
    return mapBackendAccountToFrontend(response.data.payload);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ACCOUNT_API}/delete/${id}`);
  },
};
