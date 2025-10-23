import { CurrencyType } from './common.types';

export interface Account {
  id: string;
  accountNo: string;
  iban: string;
  amount: number;
  currencyType: CurrencyType;
  customerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAccountRequest {
  accountNo: string;
  iban: string;
  amount: number;
  currencyType: CurrencyType;
  customerId?: string;
}

export interface UpdateAccountRequest extends CreateAccountRequest {
  id: string;
}
