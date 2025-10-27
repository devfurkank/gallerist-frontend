import { Car } from './car.types';
import { Gallerist } from './gallerist.types';

export interface GalleristCar {
  id: string;
  gallerist: Gallerist;
  car: Car;
  createTime?: string;
}

export interface CreateGalleristCarRequest {
  galleristId: number;
  carId: number;
}

export interface UpdateGalleristCarRequest {
  galleristId: number;
  carId: number;
}
