import { format as dateFnsFormat, parseISO } from 'date-fns';

export const formatCurrency = (amount: number, currency: string = 'TL'): string => {
  const currencySymbols: Record<string, string> = {
    TL: '₺',
    USD: '$',
  };

  const symbol = currencySymbols[currency] || currency;

  return `${symbol}${amount.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (date: string | Date, formatString: string = 'dd.MM.yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateFnsFormat(dateObj, formatString);
  } catch {
    return '-';
  }
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd.MM.yyyy HH:mm');
};

export const formatPlate = (plate: string): string => {
  return plate.toUpperCase().replace(/\s+/g, ' ').trim();
};

export const formatTCKN = (tckn: string): string => {
  return tckn.replace(/\D/g, '').slice(0, 11);
};

export const formatIBAN = (iban: string): string => {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
};

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Extract error message from API error response
 * Handles backend error format: { status: number, exception: { message: string, ... } }
 */
export const extractErrorMessage = (error: any, defaultMessage: string = 'An error occurred'): string => {
  // Backend error format
  if (error.response?.data?.exception?.message) {
    const msg = error.response.data.exception.message;
    // If message is an object (validation errors), convert to string
    if (typeof msg === 'object') {
      return Object.entries(msg)
        .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
        .join('; ');
    }
    return msg;
  }
  
  // Alternative formats
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  // Axios error message
  if (error.message) {
    return error.message;
  }
  
  return defaultMessage;
};
