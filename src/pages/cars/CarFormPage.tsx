import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { carSchema, type CarFormData } from '../../lib/schemas/car.schema';
import { carsApi } from '../../lib/api/cars';
import { CAR_STATUS, CURRENCY_TYPES } from '../../lib/utils/constants';

export function CarFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: car } = useQuery({
    queryKey: ['car', id],
    queryFn: () => carsApi.getById(id!),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
  });

  useEffect(() => {
    if (car) {
      reset(car);
    }
  }, [car, reset]);

  const createMutation = useMutation({
    mutationFn: carsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      toast.success('Car created successfully');
      navigate('/dashboard/cars');
    },
    onError: () => {
      toast.error('Failed to create car');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CarFormData) => carsApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['car', id] });
      toast.success('Car updated successfully');
      navigate('/dashboard/cars');
    },
    onError: () => {
      toast.error('Failed to update car');
    },
  });

  const onSubmit = (data: CarFormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/cars')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Edit Car' : 'Add New Car'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEdit ? 'Update car information' : 'Enter car details'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Car Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plate">License Plate*</Label>
                <Input id="plate" placeholder="34 ABC 1234" {...register('plate')} />
                {errors.plate && <p className="text-sm text-red-600">{errors.plate.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="productionYear">Production Year*</Label>
                <Input
                  id="productionYear"
                  type="number"
                  placeholder="2023"
                  {...register('productionYear', { valueAsNumber: true })}
                />
                {errors.productionYear && <p className="text-sm text-red-600">{errors.productionYear.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand*</Label>
                <Input id="brand" placeholder="BMW" {...register('brand')} />
                {errors.brand && <p className="text-sm text-red-600">{errors.brand.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model*</Label>
                <Input id="model" placeholder="3 Series" {...register('model')} />
                {errors.model && <p className="text-sm text-red-600">{errors.model.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price*</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="50000"
                  {...register('price', { valueAsNumber: true })}
                />
                {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currencyType">Currency*</Label>
                <select
                  id="currencyType"
                  {...register('currencyType')}
                  className="flex h-10 w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option value={CURRENCY_TYPES.TL}>TL (₺)</option>
                  <option value={CURRENCY_TYPES.USD}>USD ($)</option>
                </select>
                {errors.currencyType && <p className="text-sm text-red-600">{errors.currencyType.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="damagePrice">Damage Price (Optional)</Label>
                <Input
                  id="damagePrice"
                  type="number"
                  step="0.01"
                  placeholder="5000"
                  {...register('damagePrice', { valueAsNumber: true })}
                />
                {errors.damagePrice && <p className="text-sm text-red-600">{errors.damagePrice.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="carStatusType">Status*</Label>
                <select
                  id="carStatusType"
                  {...register('carStatusType')}
                  className="flex h-10 w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option value={CAR_STATUS.SALABLE}>SALABLE</option>
                  <option value={CAR_STATUS.SOLD}>SOLD</option>
                </select>
                {errors.carStatusType && <p className="text-sm text-red-600">{errors.carStatusType.message}</p>}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saving...'
                  : isEdit
                  ? 'Update Car'
                  : 'Create Car'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard/cars')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
