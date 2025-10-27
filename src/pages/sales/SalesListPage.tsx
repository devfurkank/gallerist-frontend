import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, User, Car as CarIcon, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { DeleteDialog } from '../../components/ui/delete-dialog';
import { salesApi } from '../../lib/api/sales';
import { formatCurrency, formatDate } from '../../lib/utils/format';
import type { Sale } from '../../lib/types';

export function SalesListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; sale: Sale | null }>({
    open: false,
    sale: null,
  });

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: salesApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: salesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success('Sale deleted successfully');
      setDeleteDialog({ open: false, sale: null });
    },
    onError: () => {
      toast.error('Failed to delete sale');
      setDeleteDialog({ open: false, sale: null });
    },
  });

  const filteredSales = sales.filter(
    (sale) =>
      sale.customer?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      sale.customer?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      sale.car?.brand?.toLowerCase().includes(search.toLowerCase()) ||
      sale.car?.model?.toLowerCase().includes(search.toLowerCase()) ||
      sale.car?.plate?.toLowerCase().includes(search.toLowerCase()) ||
      sale.gallerist?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      sale.gallerist?.lastName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (sale: Sale) => {
    setDeleteDialog({ open: true, sale });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.sale) {
      deleteMutation.mutate(deleteDialog.sale.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Sales</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage car sales records</p>
        </div>
        <Button onClick={() => navigate('/dashboard/sales/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Sale
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by customer, car or gallerist name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredSales.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">No sales found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSales.map((sale) => (
            <Card key={sale.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">Sale #{sale.id}</CardTitle>
                  <Badge variant="success">Completed</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Car Info */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <CarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vehicle</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {sale.car?.brand} {sale.car?.model}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {sale.car?.plate} • {sale.car?.productionYear}
                      </p>
                      {sale.car?.price && (
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-1">
                          {formatCurrency(sale.car.price, sale.car.currencyType)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {sale.customer?.firstName} {sale.customer?.lastName}
                      </p>
                      {sale.customer?.tckn && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          TC: {sale.customer.tckn}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Gallerist Info */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <UserCircle className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sales Representative</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {sale.gallerist?.firstName} {sale.gallerist?.lastName}
                      </p>
                    </div>
                  </div>

                  {/* Date and Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {sale.createTime ? formatDate(sale.createTime) : '-'}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/dashboard/sales/${sale.id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(sale)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, sale: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Sale"
        description="Are you sure you want to delete this sale record? This action cannot be undone."
        itemName={deleteDialog.sale ? `Sale #${deleteDialog.sale.id} - ${deleteDialog.sale.car?.brand} ${deleteDialog.sale.car?.model}` : ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

