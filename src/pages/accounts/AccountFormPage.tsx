import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { accountSchema, type AccountFormData } from '../../lib/schemas/account.schema';
import { accountsApi } from '../../lib/api/accounts';
import { CURRENCY_TYPES } from '../../lib/utils/constants';

export function AccountFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: account } = useQuery({
    queryKey: ['account', id],
    queryFn: async () => {
      // Backend doesn't have getById, so we'll fetch all and find the one we need
      const accounts = await accountsApi.getAll();
      const found = accounts.find((a) => a.id === id);
      if (!found) throw new Error('Account not found');
      return found;
    },
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      accountNo: '',
      iban: '',
      amount: 0,
      currencyType: 'TL',
    },
  });

  useEffect(() => {
    if (account) {
      reset({
        accountNo: account.accountNo,
        iban: account.iban,
        amount: account.amount,
        currencyType: account.currencyType,
      });
    }
  }, [account, reset]);

  const createMutation = useMutation({
    mutationFn: accountsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Account created successfully');
      navigate('/dashboard/accounts');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.errorMessage || 'Failed to create account');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: AccountFormData) => accountsApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account', id] });
      toast.success('Account updated successfully');
      navigate('/dashboard/accounts');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.errorMessage || 'Failed to update account');
    },
  });

  const onSubmit = (data: AccountFormData) => {
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
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/accounts')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Edit Account' : 'Add New Account'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEdit ? 'Update account information' : 'Enter new account details'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="accountNo">
                  Account Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="accountNo"
                  placeholder="e.g., 1234567890"
                  {...register('accountNo')}
                  className={errors.accountNo ? 'border-red-500' : ''}
                />
                {errors.accountNo && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.accountNo.message}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enter your bank account number
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="iban">
                  IBAN <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="iban"
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                  {...register('iban')}
                  className={errors.iban ? 'border-red-500' : ''}
                  maxLength={26}
                />
                {errors.iban && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.iban.message}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  26-digit IBAN number starting with TR
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">
                  Balance <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className={errors.amount ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.amount && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.amount.message}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Current balance in the account
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currencyType">
                  Currency <span className="text-red-500">*</span>
                </Label>
                <select
                  id="currencyType"
                  {...register('currencyType')}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.currencyType ? 'border-red-500' : ''
                  }`}
                >
                  <option value={CURRENCY_TYPES.TL}>Turkish Lira (TL)</option>
                  <option value={CURRENCY_TYPES.USD}>US Dollar (USD)</option>
                </select>
                {errors.currencyType && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.currencyType.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Select the account currency
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> All fields are required. Make sure the IBAN starts with "TR" and is 26 
                characters long.
              </p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/accounts')}
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
                  <>{isEdit ? 'Update Account' : 'Create Account'}</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isEdit && account && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Account Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Account No:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {account.accountNo}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">IBAN:</span>
                <span className="text-sm font-mono text-gray-900 dark:text-gray-100">
                  {account.iban}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Balance:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: account.currencyType === 'TL' ? 'TRY' : account.currencyType,
                  }).format(account.amount)}
                </span>
              </div>
              {account.createdAt && (
                <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                  Created: {new Date(account.createdAt).toLocaleDateString('en-US', {
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

