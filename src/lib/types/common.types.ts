// Backend response format
export interface RootEntity<T> {
  status: number;
  payload: T;
  errorMessage: string | null;
}

export type CarStatus = 'SALABLE' | 'SOLD';
export type CurrencyType = 'TL' | 'USD';

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface FilterParams {
  search?: string;
  [key: string]: string | number | boolean | undefined;
}
