import { Address } from './address.types';
import { Account } from './account.types';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  tckn: string;
  birthDate: string;
  address?: Address;
  addressId?: string;
  account?: Account;
  accountId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  tckn: string;
  birthDate: string;
  addressId?: string;
  accountId?: string;
}

export interface UpdateCustomerRequest extends CreateCustomerRequest {
  id: string;
}
