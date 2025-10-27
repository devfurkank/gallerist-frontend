import { Car } from './car.types';
import { Gallerist } from './gallerist.types';
import { Customer } from './customer.types';

export interface Sale {
  id: string;
  car?: Car;
  gallerist?: Gallerist;
  customer?: Customer;
  createTime?: string;
  updatedAt?: string;
}

export interface CreateSaleRequest {
  carId: number;
  galleristId: number;
  customerId: number;
}

export interface UpdateSaleRequest {
  carId: number;
  galleristId: number;
  customerId: number;
}

export interface SaleFilters {
  search?: string;
  galleristId?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
}
