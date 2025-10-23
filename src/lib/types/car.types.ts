import { CarStatus, CurrencyType } from './common.types';

export interface Car {
  id: string;
  plate: string;
  brand: string;
  model: string;
  productionYear: number;
  price: number;
  currencyType: CurrencyType;
  damagePrice?: number;
  carStatusType: CarStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCarRequest {
  plate: string;
  brand: string;
  model: string;
  productionYear: number;
  price: number;
  currencyType: CurrencyType;
  damagePrice?: number;
  carStatusType: CarStatus;
}

export interface UpdateCarRequest extends CreateCarRequest {
  id: string;
}

export interface CarFilters {
  search?: string;
  status?: CarStatus;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  currency?: CurrencyType;
}
