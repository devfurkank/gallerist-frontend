import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { customerSchema, type CustomerFormData } from '../../lib/schemas/customer.schema';
import { customersApi } from '../../lib/api/customers';
import { addressesApi } from '../../lib/api/addresses';
import { accountsApi } from '../../lib/api/accounts';

export function CustomerFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: customer } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customersApi.getById(id!),
    enabled: isEdit,
  });

  const { data: addresses = [] } = useQuery({
    queryKey: ['addresses'],
    queryFn: addressesApi.getAll,
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAll,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      tckn: '',
      birthDate: '',
      addressId: '',
      accountId: '',
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        firstName: customer.firstName,
        lastName: customer.lastName,
        tckn: customer.tckn,
        birthDate: customer.birthDate,
        addressId: customer.address?.id || '',
        accountId: customer.account?.id || '',
      });
    }
  }, [customer, reset]);

  const createMutation = useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer created successfully');
      navigate('/dashboard/customers');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.errorMessage || 'Failed to create customer');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CustomerFormData) => customersApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      toast.success('Customer updated successfully');
      navigate('/dashboard/customers');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.errorMessage || 'Failed to update customer');
    },
  });

  const onSubmit = (data: CustomerFormData) => {
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
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/customers')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEdit ? 'Update customer information' : 'Enter new customer details'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="e.g., John"
                  {...register('firstName')}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.firstName.message}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enter customer's first name
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="e.g., Doe"
                  {...register('lastName')}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.lastName.message}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enter customer's last name
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tckn">
                  TCKN <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tckn"
                  placeholder="12345678901"
                  maxLength={11}
                  {...register('tckn')}
                  className={errors.tckn ? 'border-red-500' : ''}
                />
                {errors.tckn && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.tckn.message}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  11-digit Turkish National ID
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">
                  Birth Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  {...register('birthDate')}
                  className={errors.birthDate ? 'border-red-500' : ''}
                />
                {errors.birthDate && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.birthDate.message}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Customer's date of birth
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressId">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="addressId"
                  control={control}
                  render={({ field }) => (
                    <select
                      id="addressId"
                      {...field}
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.addressId ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="">Select an address</option>
                      {addresses.map((address) => (
                        <option key={address.id} value={address.id}>
                          {address.city} - {address.district} - {address.neighborhood}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.addressId && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.addressId.message}</p>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Select customer's address
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => window.open('/dashboard/addresses/new', '_blank')}
                    className="text-xs h-auto p-0"
                  >
                    Create new address
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountId">
                  Account <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="accountId"
                  control={control}
                  render={({ field }) => (
                    <select
                      id="accountId"
                      {...field}
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.accountId ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="">Select an account</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.accountNo} - {account.iban} ({account.currencyType})
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.accountId && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.accountId.message}</p>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Select customer's account
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => window.open('/dashboard/accounts/new', '_blank')}
                    className="text-xs h-auto p-0"
                  >
                    Create new account
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> All fields are required. Make sure the TCKN is valid and the address and account are selected from existing records.
              </p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/customers')}
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
                  <>{isEdit ? 'Update Customer' : 'Create Customer'}</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isEdit && customer && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Customer Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {customer.firstName} {customer.lastName}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">TCKN:</span>
                <span className="text-sm font-mono text-gray-900 dark:text-gray-100">
                  {customer.tckn}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Birth Date:</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {new Date(customer.birthDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              {customer.address && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Address:</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100 text-right">
                    {customer.address.city}, {customer.address.district}
                  </span>
                </div>
              )}
              {customer.account && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Account:</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {customer.account.accountNo}
                  </span>
                </div>
              )}
              {customer.createdAt && (
                <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                  Created: {new Date(customer.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

