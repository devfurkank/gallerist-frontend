// Backend API Base Paths
export const API_ENDPOINTS = {
  CAR: '/rest/api/car',
  CUSTOMER: '/rest/api/customer',
  GALLERIST: '/rest/api/gallerist',
  ACCOUNT: '/rest/api/account',
  ADDRESS: '/rest/api/address',
  SALED_CAR: '/rest/api/saled-car',
  GALLERIST_CAR: '/rest/api/gallerist-car',
  CURRENCY_RATES: '/rest/api/currency-rates',
  AUTH: '', // Auth endpoints have no prefix
} as const;

export const CAR_STATUS = {
  SALABLE: 'SALABLE',
  SOLD: 'SOLD',
} as const;

export const CURRENCY_TYPES = {
  TL: 'TL',
  USD: 'USD',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CARS: '/dashboard/cars',
  CAR_DETAIL: '/dashboard/cars/:id',
  CAR_NEW: '/dashboard/cars/new',
  CAR_EDIT: '/dashboard/cars/:id/edit',
  GALLERISTS: '/dashboard/gallerists',
  GALLERIST_DETAIL: '/dashboard/gallerists/:id',
  GALLERIST_NEW: '/dashboard/gallerists/new',
  GALLERIST_EDIT: '/dashboard/gallerists/:id/edit',
  CUSTOMERS: '/dashboard/customers',
  CUSTOMER_DETAIL: '/dashboard/customers/:id',
  CUSTOMER_NEW: '/dashboard/customers/new',
  CUSTOMER_EDIT: '/dashboard/customers/:id/edit',
  SALES: '/dashboard/sales',
  SALE_DETAIL: '/dashboard/sales/:id',
  SALE_NEW: '/dashboard/sales/new',
  ACCOUNTS: '/dashboard/accounts',
  ACCOUNT_DETAIL: '/dashboard/accounts/:id',
  ACCOUNT_NEW: '/dashboard/accounts/new',
  ADDRESSES: '/dashboard/addresses',
  ADDRESS_DETAIL: '/dashboard/addresses/:id',
  ADDRESS_NEW: '/dashboard/addresses/new',
  INVENTORY: '/dashboard/inventory',
  ANALYTICS: '/dashboard/analytics',
  SETTINGS: '/dashboard/settings',
} as const;

export const TURKISH_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
  'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
  'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale',
  'Kırklareli', 'Kırşehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye',
  'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak',
  'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak',
];

export const CAR_BRANDS = [
  'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Ford', 'Toyota', 'Honda', 'Hyundai',
  'Kia', 'Nissan', 'Mazda', 'Chevrolet', 'Peugeot', 'Renault', 'Fiat', 'Opel',
  'Seat', 'Skoda', 'Volvo', 'Porsche', 'Tesla', 'Lexus', 'Mitsubishi', 'Suzuki',
  'Dacia', 'Citroen', 'Alfa Romeo', 'Jeep', 'Land Rover', 'Jaguar', 'Mini', 'Smart',
];
