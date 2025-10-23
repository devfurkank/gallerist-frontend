import { Car } from './car.types';
import { Gallerist } from './gallerist.types';

export interface GalleristCar {
  id: string;
  gallerist: Gallerist;
  galleristId: string;
  car: Car;
  carId: string;
  assignedDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGalleristCarRequest {
  galleristId: string;
  carId: string;
}

export interface UpdateGalleristCarRequest extends CreateGalleristCarRequest {
  id: string;
}
