import { Car } from './car.types';
import { Gallerist } from './gallerist.types';
import { Customer } from './customer.types';

export interface Sale {
  id: string;
  car: Car;
  carId: string;
  gallerist: Gallerist;
  galleristId: string;
  customer: Customer;
  customerId: string;
  saleDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSaleRequest {
  carId: string;
  galleristId: string;
  customerId: string;
}

export interface UpdateSaleRequest extends CreateSaleRequest {
  id: string;
}

export interface SaleFilters {
  search?: string;
  galleristId?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
}
