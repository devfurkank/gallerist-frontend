export enum CurrencyType {
  TL = 'TL',
  USD = 'USD',
}

// Backend response format (as received from API)
export interface CurrencyRatesItemBackend {
  Tarih: string;
  TP_DK_USD_A: string;
}

// Frontend format (mapped)
export interface CurrencyRatesItem {
  date: string;
  usd: string;
}

export interface CurrencyRatesResponseBackend {
  totalCount: number;
  items: CurrencyRatesItemBackend[];
}

export interface CurrencyRatesResponse {
  totalCount: number;
  items: CurrencyRatesItem[];
}

export interface CurrencyRatesQueryParams {
  startDate: string;
  endDate: string;
}

