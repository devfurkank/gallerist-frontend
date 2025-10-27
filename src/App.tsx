import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme/theme-provider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { CarsListPage } from './pages/cars/CarsListPage';
import { CarFormPage } from './pages/cars/CarFormPage';
import { GalleristsListPage } from './pages/gallerists/GalleristsListPage';
import { GalleristFormPage } from './pages/gallerists/GalleristFormPage';
import { AddressesListPage } from './pages/addresses/AddressesListPage';
import { AddressFormPage } from './pages/addresses/AddressFormPage';
import { AccountsListPage } from './pages/accounts/AccountsListPage';
import { AccountFormPage } from './pages/accounts/AccountFormPage';
import { CustomersListPage } from './pages/customers/CustomersListPage';
import { CustomerFormPage } from './pages/customers/CustomerFormPage';
import { InventoryListPage } from './pages/inventory/InventoryListPage';
import { InventoryFormPage } from './pages/inventory/InventoryFormPage';
import { CurrencyRatesPage } from './pages/currency-rates/CurrencyRatesPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />

              <Route path="cars" element={<CarsListPage />} />
              <Route path="cars/new" element={<CarFormPage />} />
              <Route path="cars/:id/edit" element={<CarFormPage />} />

              <Route path="gallerists" element={<GalleristsListPage />} />
              <Route path="gallerists/new" element={<GalleristFormPage />} />
              <Route path="gallerists/:id/edit" element={<GalleristFormPage />} />

              <Route path="addresses" element={<AddressesListPage />} />
              <Route path="addresses/new" element={<AddressFormPage />} />
              <Route path="addresses/:id/edit" element={<AddressFormPage />} />
              
              <Route path="accounts" element={<AccountsListPage />} />
              <Route path="accounts/new" element={<AccountFormPage />} />
              <Route path="accounts/:id/edit" element={<AccountFormPage />} />
              
              <Route path="customers" element={<CustomersListPage />} />
              <Route path="customers/new" element={<CustomerFormPage />} />
              <Route path="customers/:id/edit" element={<CustomerFormPage />} />
              <Route
                path="sales"
                element={<PlaceholderPage title="Sales" description="Manage sales" />}
              />
              <Route path="inventory" element={<InventoryListPage />} />
              <Route path="inventory/new" element={<InventoryFormPage />} />
              <Route path="inventory/:id/edit" element={<InventoryFormPage />} />
              <Route path="currency-rates" element={<CurrencyRatesPage />} />
              <Route
                path="settings"
                element={<PlaceholderPage title="Settings" description="Application settings" />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
