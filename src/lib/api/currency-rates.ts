import apiClient from './client';
import type { CurrencyRatesResponse, CurrencyRatesResponseBackend, CurrencyRatesQueryParams, RootEntity } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

const CURRENCY_API = API_ENDPOINTS.CURRENCY_RATES;

// Convert date from YYYY-MM-DD to DD-MM-YYYY format for backend
const formatDateForBackend = (date: string): string => {
  const [year, month, day] = date.split('-');
  return `${day}-${month}-${year}`;
};

// Map backend response to frontend format
const mapBackendToFrontend = (backendResponse: CurrencyRatesResponseBackend): CurrencyRatesResponse => {
  return {
    totalCount: backendResponse.totalCount,
    items: backendResponse.items.map(item => ({
      date: item.Tarih,
      usd: item.TP_DK_USD_A,
    })),
  };
};

export const currencyRatesApi = {
  getCurrencyRates: async (params: CurrencyRatesQueryParams): Promise<CurrencyRatesResponse> => {
    // Convert date format from YYYY-MM-DD to DD-MM-YYYY
    const formattedParams = {
      startDate: formatDateForBackend(params.startDate),
      endDate: formatDateForBackend(params.endDate),
    };
    
    const response = await apiClient.get<RootEntity<CurrencyRatesResponseBackend>>(
      CURRENCY_API,
      { params: formattedParams }
    );
    return mapBackendToFrontend(response.data.payload);
  },

  getCurrentRate: async (): Promise<CurrencyRatesResponse> => {
    const today = new Date().toISOString().split('T')[0];
    return currencyRatesApi.getCurrencyRates({
      startDate: today,
      endDate: today,
    });
  },
};

