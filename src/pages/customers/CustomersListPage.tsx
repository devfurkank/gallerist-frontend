import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { DeleteDialog } from '../../components/ui/delete-dialog';
import { customersApi } from '../../lib/api/customers';
import type { Customer } from '../../lib/types';

export function CustomersListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; customer: Customer | null }>({
    open: false,
    customer: null,
  });

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: customersApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: customersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted successfully');
      setDeleteDialog({ open: false, customer: null });
    },
    onError: () => {
      toast.error('Failed to delete customer');
      setDeleteDialog({ open: false, customer: null });
    },
  });

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      customer.tckn.includes(search)
  );

  const handleDeleteClick = (customer: Customer) => {
    setDeleteDialog({ open: true, customer });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.customer) {
      deleteMutation.mutate(deleteDialog.customer.id);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Customers</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all customers</p>
        </div>
        <Button onClick={() => navigate('/dashboard/customers/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by name or TCKN..."
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
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {search ? 'No customers found' : 'No customers yet'}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {search
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first customer'}
              </p>
              {!search && (
                <Button onClick={() => navigate('/dashboard/customers/new')} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Add Customer
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      TCKN
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Birth Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Account
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {customer.firstName} {customer.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                          {customer.tckn}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatDate(customer.birthDate)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {customer.address ? (
                          <div className="text-sm">
                            <div className="text-gray-900 dark:text-gray-100">
                              {customer.address.city}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">
                              {customer.address.district}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {customer.account ? (
                          <div className="text-sm space-y-1">
                            <div className="text-gray-500 dark:text-gray-400 text-xs">
                              {customer.account.accountNo}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {new Intl.NumberFormat('tr-TR', {
                                  style: 'currency',
                                  currency: customer.account.currencyType === 'TL' ? 'TRY' : customer.account.currencyType,
                                  minimumFractionDigits: 2,
                                }).format(customer.account.amount)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/dashboard/customers/${customer.id}/edit`)}
                            title="Edit customer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(customer)}
                            title="Delete customer"
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

      {!isLoading && filteredCustomers.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <p>
            Showing <span className="font-medium text-gray-900 dark:text-gray-100">{filteredCustomers.length}</span> of{' '}
            <span className="font-medium text-gray-900 dark:text-gray-100">{customers.length}</span> customers
          </p>
        </div>
      )}

      <DeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, customer: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
        itemName={deleteDialog.customer ? `${deleteDialog.customer.firstName} ${deleteDialog.customer.lastName} (${deleteDialog.customer.tckn})` : ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

