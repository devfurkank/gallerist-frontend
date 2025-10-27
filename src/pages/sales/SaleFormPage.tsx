import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { saleSchema, type SaleFormData } from '../../lib/schemas/sale.schema';
import { salesApi } from '../../lib/api/sales';
import { carsApi } from '../../lib/api/cars';
import { customersApi } from '../../lib/api/customers';
import { galleristsApi } from '../../lib/api/gallerists';
import { formatCurrency } from '../../lib/utils/format';

export function SaleFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  
  const [customerSearch, setCustomerSearch] = useState('');
  const [galleristSearch, setGalleristSearch] = useState('');
  const [carSearch, setCarSearch] = useState('');

  const { data: sale } = useQuery({
    queryKey: ['sale', id],
    queryFn: () => salesApi.getById(id!),
    enabled: isEdit,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: customersApi.getAll,
  });

  const { data: gallerists = [] } = useQuery({
    queryKey: ['gallerists'],
    queryFn: galleristsApi.getAll,
  });

  const { data: cars = [] } = useQuery({
    queryKey: ['cars'],
    queryFn: carsApi.getAll,
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
  });

  useEffect(() => {
    if (sale && isEdit) {
      reset({
        customerId: parseInt(sale.customer?.id || '0'),
        galleristId: parseInt(sale.gallerist?.id || '0'),
        carId: parseInt(sale.car?.id || '0'),
      });
    }
  }, [sale, isEdit, reset]);

  const selectedCarId = watch('carId');
  const selectedCustomerId = watch('customerId');
  const selectedCar = cars.find(c => c.id === selectedCarId?.toString());
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId?.toString());

  const createMutation = useMutation({
    mutationFn: salesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Sale created successfully');
      navigate('/dashboard/sales');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create sale';
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: SaleFormData) => salesApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['sale', id] });
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Sale updated successfully');
      navigate('/dashboard/sales');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update sale';
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: SaleFormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName?.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.tckn?.includes(customerSearch)
  );

  const filteredGallerists = gallerists.filter(
    (gallerist) =>
      gallerist.firstName?.toLowerCase().includes(galleristSearch.toLowerCase()) ||
      gallerist.lastName?.toLowerCase().includes(galleristSearch.toLowerCase())
  );

  const filteredCars = cars.filter(
    (car) =>
      car.carStatusType === 'SALABLE' &&
      (car.brand?.toLowerCase().includes(carSearch.toLowerCase()) ||
      car.model?.toLowerCase().includes(carSearch.toLowerCase()) ||
      car.plate?.toLowerCase().includes(carSearch.toLowerCase()))
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/sales')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Edit Sale' : 'New Sale'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEdit ? 'Update sale information' : 'Complete a car sale transaction'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sale Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Selection */}
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer*</Label>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customer..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Controller
                name="customerId"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    <option value="">Select customer</option>
                    {filteredCustomers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.firstName} {customer.lastName} {customer.tckn ? `(${customer.tckn})` : ''}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.customerId && <p className="text-sm text-red-600">{errors.customerId.message}</p>}
              {selectedCustomer && selectedCustomer.account && (
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <span className="font-medium">Customer Balance:</span>{' '}
                    {formatCurrency(selectedCustomer.account.amount, selectedCustomer.account.currencyType)}
                  </p>
                </div>
              )}
            </div>

            {/* Gallerist Selection */}
            <div className="space-y-2">
              <Label htmlFor="galleristId">Sales Representative*</Label>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search gallerist..."
                  value={galleristSearch}
                  onChange={(e) => setGalleristSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Controller
                name="galleristId"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    <option value="">Select sales representative</option>
                    {filteredGallerists.map((gallerist) => (
                      <option key={gallerist.id} value={gallerist.id}>
                        {gallerist.firstName} {gallerist.lastName}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.galleristId && <p className="text-sm text-red-600">{errors.galleristId.message}</p>}
            </div>

            {/* Car Selection */}
            <div className="space-y-2">
              <Label htmlFor="carId">Car*</Label>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search car..."
                  value={carSearch}
                  onChange={(e) => setCarSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Controller
                name="carId"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    <option value="">Select car (Salable cars only)</option>
                    {filteredCars.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.brand} {car.model} - {car.plate} ({car.productionYear}) - {formatCurrency(car.price, car.currencyType)}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.carId && <p className="text-sm text-red-600">{errors.carId.message}</p>}
              {selectedCar && (
                <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-900 dark:text-green-200">
                    <span className="font-medium">Car Price:</span>{' '}
                    {formatCurrency(selectedCar.price, selectedCar.currencyType)}
                  </p>
                </div>
              )}
            </div>

            {selectedCustomer && selectedCar && selectedCustomer.account && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-900 dark:text-yellow-200">
                  <span className="font-medium">Note:</span> When the sale is completed, the vehicle price will be deducted from the customer's balance.
                  {selectedCustomer.account.currencyType !== selectedCar.currencyType && (
                    <span> Currency exchange rate will be calculated automatically.</span>
                  )}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saving...'
                  : isEdit
                  ? 'Update Sale'
                  : 'Complete Sale'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard/sales')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

