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
import { galleristSchema, type GalleristFormData } from '../../lib/schemas/gallerist.schema';
import { galleristsApi } from '../../lib/api/gallerists';

export function GalleristFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: gallerist } = useQuery({
    queryKey: ['gallerist', id],
    queryFn: () => galleristsApi.getById(id!),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GalleristFormData>({
    resolver: zodResolver(galleristSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      address: {
        city: '',
        district: '',
        neighborhood: '',
        street: '',
      },
    },
  });

  useEffect(() => {
    if (gallerist) {
      reset({
        firstName: gallerist.firstName,
        lastName: gallerist.lastName,
        address: gallerist.address || {
          city: '',
          district: '',
          neighborhood: '',
          street: '',
        },
      });
    }
  }, [gallerist, reset]);

  const createMutation = useMutation({
    mutationFn: galleristsApi.createWithAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallerists'] });
      toast.success('Gallerist created successfully');
      navigate('/dashboard/gallerists');
    },
    onError: () => {
      toast.error('Failed to create gallerist');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: GalleristFormData) => 
      galleristsApi.updateWithAddress(id!, {
        ...data,
        addressId: gallerist?.address?.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallerists'] });
      queryClient.invalidateQueries({ queryKey: ['gallerist', id] });
      toast.success('Gallerist updated successfully');
      navigate('/dashboard/gallerists');
    },
    onError: () => {
      toast.error('Failed to update gallerist');
    },
  });

  const onSubmit = (data: GalleristFormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/gallerists')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Edit Gallerist' : 'Add New Gallerist'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEdit ? 'Update gallerist information' : 'Enter gallerist details'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gallerist Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name*</Label>
                  <Input id="firstName" placeholder="John" {...register('firstName')} />
                  {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name*</Label>
                  <Input id="lastName" placeholder="Doe" {...register('lastName')} />
                  {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Address Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City*</Label>
                  <Input id="city" placeholder="Istanbul" {...register('address.city')} />
                  {errors.address?.city && <p className="text-sm text-red-600">{errors.address.city.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District*</Label>
                  <Input id="district" placeholder="Kadıköy" {...register('address.district')} />
                  {errors.address?.district && <p className="text-sm text-red-600">{errors.address.district.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Neighborhood*</Label>
                  <Input id="neighborhood" placeholder="Moda" {...register('address.neighborhood')} />
                  {errors.address?.neighborhood && <p className="text-sm text-red-600">{errors.address.neighborhood.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street*</Label>
                  <Input id="street" placeholder="Bahariye St. No: 123" {...register('address.street')} />
                  {errors.address?.street && <p className="text-sm text-red-600">{errors.address.street.message}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saving...'
                  : isEdit
                  ? 'Update Gallerist'
                  : 'Create Gallerist'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard/gallerists')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

