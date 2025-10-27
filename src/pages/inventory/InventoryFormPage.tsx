import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { galleristCarSchema, type GalleristCarFormData } from '../../lib/schemas/inventory.schema';
import { inventoryApi } from '../../lib/api/inventory';
import { galleristsApi } from '../../lib/api/gallerists';
import { carsApi } from '../../lib/api/cars';

export function InventoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: gallerists = [] } = useQuery({
    queryKey: ['gallerists'],
    queryFn: galleristsApi.getAll,
  });

  const { data: cars = [] } = useQuery({
    queryKey: ['cars'],
    queryFn: carsApi.getAll,
  });

  // Filter only SALABLE cars for new assignments
  const availableCars = isEdit ? cars : cars.filter(car => car.carStatusType === 'SALABLE');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GalleristCarFormData>({
    resolver: zodResolver(galleristCarSchema),
    defaultValues: {
      galleristId: 0,
      carId: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: inventoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Car assigned successfully');
      navigate('/dashboard/inventory');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to assign car');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: GalleristCarFormData) => inventoryApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Car assignment updated successfully');
      navigate('/dashboard/inventory');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update car assignment');
    },
  });

  const onSubmit = (data: GalleristCarFormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const selectedGalleristId = watch('galleristId');
  const selectedCarId = watch('carId');

  const selectedGallerist = gallerists.find(g => g.id === selectedGalleristId?.toString());
  const selectedCar = cars.find(c => c.id === selectedCarId?.toString());

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/inventory')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Edit Car Assignment' : 'Assign Car to Gallerist'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEdit ? 'Update assignment details' : 'Select gallerist and car'}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="galleristId">Gallerist*</Label>
                <select
                  id="galleristId"
                  {...register('galleristId', { valueAsNumber: true })}
                  className="flex h-10 w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={0}>Select a gallerist...</option>
                  {gallerists.map((gallerist) => (
                    <option key={gallerist.id} value={Number(gallerist.id)}>
                      {gallerist.firstName} {gallerist.lastName}
                      {gallerist.address?.city ? ` - ${gallerist.address.city}` : ''}
                    </option>
                  ))}
                </select>
                {errors.galleristId && (
                  <p className="text-sm text-red-600">{errors.galleristId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="carId">Car*</Label>
                <select
                  id="carId"
                  {...register('carId', { valueAsNumber: true })}
                  className="flex h-10 w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={0}>Select a car...</option>
                  {availableCars.map((car) => (
                    <option key={car.id} value={Number(car.id)}>
                      {car.brand} {car.model} - {car.plate} ({car.productionYear})
                    </option>
                  ))}
                </select>
                {errors.carId && (
                  <p className="text-sm text-red-600">{errors.carId.message}</p>
                )}
                {!isEdit && availableCars.length === 0 && (
                  <p className="text-sm text-amber-600">No salable cars available</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : isEdit
                    ? 'Update Assignment'
                    : 'Assign Car'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard/inventory')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <div className="space-y-4">
          {selectedGallerist && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Gallerist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedGallerist.firstName} {selectedGallerist.lastName}
                  </p>
                </div>
                {selectedGallerist.address && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {selectedGallerist.address.city}, {selectedGallerist.address.district}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {selectedCar && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Car</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Vehicle</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedCar.brand} {selectedCar.model}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Plate</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">{selectedCar.plate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Year</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">{selectedCar.productionYear}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                  <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {selectedCar.currencyType === 'TRY' ? '₺' : '$'} {selectedCar.price.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

