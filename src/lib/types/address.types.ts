export interface Address {
  id: string;
  city: string;
  district: string;
  neighborhood: string;
  street: string;
  postalCode: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressRequest {
  city: string;
  district: string;
  neighborhood: string;
  street: string;
  postalCode: string;
}

export interface UpdateAddressRequest extends CreateAddressRequest {
  id: string;
}
