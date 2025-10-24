import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { addressSchema, type AddressFormData } from '../../lib/schemas/address.schema';
import { addressesApi } from '../../lib/api/addresses';
import { TURKISH_CITIES } from '../../lib/utils/constants';

export function AddressFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: address } = useQuery({
    queryKey: ['address', id],
    queryFn: () => addressesApi.getById(id!),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      city: '',
      district: '',
      neighborhood: '',
      street: '',
    },
  });

  useEffect(() => {
    if (address) {
      reset({
        city: address.city,
        district: address.district,
        neighborhood: address.neighborhood,
        street: address.street,
      });
    }
  }, [address, reset]);

  const createMutation = useMutation({
    mutationFn: addressesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address created successfully');
      navigate('/dashboard/addresses');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create address');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: AddressFormData) => addressesApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['address', id] });
      toast.success('Address updated successfully');
      navigate('/dashboard/addresses');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update address');
    },
  });

  const onSubmit = (data: AddressFormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/addresses')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Edit Address' : 'Add New Address'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEdit ? 'Update address information' : 'Enter address details'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="e.g., Istanbul"
                  {...register('city')}
                  list="turkish-cities"
                  className={errors.city ? 'border-red-500' : ''}
                />
                <datalist id="turkish-cities">
                  {TURKISH_CITIES.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
                {errors.city && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.city.message}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Select or type a Turkish city
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">
                  District <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="district"
                  placeholder="e.g., Kadıköy"
                  {...register('district')}
                  className={errors.district ? 'border-red-500' : ''}
                />
                {errors.district && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.district.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">
                  Neighborhood <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="neighborhood"
                  placeholder="e.g., Moda"
                  {...register('neighborhood')}
                  className={errors.neighborhood ? 'border-red-500' : ''}
                />
                {errors.neighborhood && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.neighborhood.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">
                  Street <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="street"
                  placeholder="e.g., Bahariye Cad. No: 123"
                  {...register('street')}
                  className={errors.street ? 'border-red-500' : ''}
                />
                {errors.street && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.street.message}</p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> All fields are required. Make sure to enter complete and accurate
                address information.
              </p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/addresses')}
                disabled={isPending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></span>
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{isEdit ? 'Update Address' : 'Create Address'}</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isEdit && address && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Address Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-900 dark:text-gray-100">
                <strong>Full Address:</strong>
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                {address.neighborhood}, {address.street}
                <br />
                {address.district} / {address.city}
              </p>
              {address.createdAt && (
                <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                  Created: {new Date(address.createdAt).toLocaleDateString('tr-TR')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


