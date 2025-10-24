export interface Address {
  id: string;
  city: string;
  district: string;
  neighborhood: string;
  street: string;
  postalCode?: string; // Optional - not used in backend
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressRequest {
  city: string;
  district: string;
  neighborhood: string;
  street: string;
}

export interface UpdateAddressRequest extends CreateAddressRequest {
  id: string;
}
