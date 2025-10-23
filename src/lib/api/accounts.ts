import apiClient from './client';
import { Account, CreateAccountRequest, UpdateAccountRequest, RootEntity } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

const ACCOUNT_API = API_ENDPOINTS.ACCOUNT;

const mapBackendAccountToFrontend = (backendAccount: any): Account => ({
  id: backendAccount.id?.toString() || '',
  accountNo: backendAccount.accountNo || '',
  iban: backendAccount.iban || '',
  amount: backendAccount.amount || 0,
  currencyType: backendAccount.currencyType || 'TRY',
  createdAt: backendAccount.createTime,
  updatedAt: backendAccount.createTime,
});

const mapFrontendAccountToBackend = (frontendAccount: CreateAccountRequest | UpdateAccountRequest): any => ({
  id: (frontendAccount as UpdateAccountRequest).id,
  accountNo: frontendAccount.accountNo,
  iban: frontendAccount.iban,
  amount: frontendAccount.amount,
  currencyType: frontendAccount.currencyType,
});

export const accountsApi = {
  getAll: async (): Promise<Account[]> => {
    // Note: Backend doesn't have list endpoint yet
    throw new Error('List endpoint not implemented in backend yet');
  },

  getById: async (_id: string): Promise<Account> => {
    // Note: Backend doesn't have getById endpoint yet
    throw new Error('GetById endpoint not implemented in backend yet');
  },

  create: async (data: CreateAccountRequest): Promise<Account> => {
    const backendData = mapFrontendAccountToBackend(data);
    const response = await apiClient.post<RootEntity<any>>(`${ACCOUNT_API}/save`, backendData);
    return mapBackendAccountToFrontend(response.data.payload);
  },

  update: async (id: string, data: UpdateAccountRequest): Promise<Account> => {
    const backendData = mapFrontendAccountToBackend({ ...data, id });
    const response = await apiClient.post<RootEntity<any>>(`${ACCOUNT_API}/save`, backendData);
    return mapBackendAccountToFrontend(response.data.payload);
  },

  delete: async (_id: string): Promise<void> => {
    // Note: Backend doesn't have delete endpoint yet
    throw new Error('Delete endpoint not implemented in backend yet');
  },
};
