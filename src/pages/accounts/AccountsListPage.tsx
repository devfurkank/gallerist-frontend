import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { DeleteDialog } from '../../components/ui/delete-dialog';
import { accountsApi } from '../../lib/api/accounts';
import type { Account } from '../../lib/types';

export function AccountsListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; account: Account | null }>({
    open: false,
    account: null,
  });

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: accountsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Account deleted successfully');
      setDeleteDialog({ open: false, account: null });
    },
    onError: () => {
      toast.error('Failed to delete account');
      setDeleteDialog({ open: false, account: null });
    },
  });

  const filteredAccounts = accounts.filter(
    (account) =>
      account.accountNo.toLowerCase().includes(search.toLowerCase()) ||
      account.iban.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (account: Account) => {
    setDeleteDialog({ open: true, account });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.account) {
      deleteMutation.mutate(deleteDialog.account.id);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency === 'TL' ? 'TRY' : currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getCurrencyBadgeColor = (currency: string) => {
    return currency === 'TL' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Accounts</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all bank accounts</p>
        </div>
        <Button onClick={() => navigate('/dashboard/accounts/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Account
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by account number or IBAN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading accounts...</p>
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {search ? 'No accounts found' : 'No accounts yet'}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {search
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first account'}
              </p>
              {!search && (
                <Button onClick={() => navigate('/dashboard/accounts/new')} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Add Account
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Account No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      IBAN
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Currency
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAccounts.map((account) => (
                    <tr
                      key={account.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {account.accountNo}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                          {account.iban}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(account.amount, account.currencyType)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge className={getCurrencyBadgeColor(account.currencyType)}>
                          {account.currencyType}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/dashboard/accounts/${account.id}/edit`)}
                            title="Edit account"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(account)}
                            disabled={deleteMutation.isPending}
                            title="Delete account"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {!isLoading && filteredAccounts.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <p>
            Showing <span className="font-medium text-gray-900 dark:text-gray-100">{filteredAccounts.length}</span> of{' '}
            <span className="font-medium text-gray-900 dark:text-gray-100">{accounts.length}</span> accounts
          </p>
        </div>
      )}

      <DeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, account: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Account"
        description="Are you sure you want to delete this account? This action cannot be undone."
        itemName={deleteDialog.account ? `${deleteDialog.account.accountNo}` : ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

