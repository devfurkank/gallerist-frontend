import { Address } from './address.types';

export interface Gallerist {
  id: string;
  firstName: string;
  lastName: string;
  address?: Address;
  addressId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGalleristRequest {
  firstName: string;
  lastName: string;
  addressId?: string;
}

export interface UpdateGalleristRequest extends CreateGalleristRequest {
  id: string;
}
