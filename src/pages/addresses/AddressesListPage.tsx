import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { DeleteDialog } from '../../components/ui/delete-dialog';
import { addressesApi } from '../../lib/api/addresses';
import type { Address } from '../../lib/types';

export function AddressesListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; address: Address | null }>({
    open: false,
    address: null,
  });

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: addressesApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: addressesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted successfully');
      setDeleteDialog({ open: false, address: null });
    },
    onError: () => {
      toast.error('Failed to delete address');
      setDeleteDialog({ open: false, address: null });
    },
  });

  const filteredAddresses = addresses.filter(
    (address) =>
      address.city.toLowerCase().includes(search.toLowerCase()) ||
      address.district.toLowerCase().includes(search.toLowerCase()) ||
      address.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
      address.street.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (address: Address) => {
    setDeleteDialog({ open: true, address });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.address) {
      deleteMutation.mutate(deleteDialog.address.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Addresses</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all addresses in the system</p>
        </div>
        <Button onClick={() => navigate('/dashboard/addresses/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search addresses by city, district, neighborhood, or street..."
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
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading addresses...</p>
            </div>
          ) : filteredAddresses.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {search ? 'No addresses found' : 'No addresses yet'}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {search
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first address'}
              </p>
              {!search && (
                <Button onClick={() => navigate('/dashboard/addresses/new')} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Add Address
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      District
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Neighborhood
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Street
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAddresses.map((address) => (
                    <tr
                      key={address.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {address.city}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-gray-900 dark:text-gray-100">{address.district}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-gray-600 dark:text-gray-400">
                          {address.neighborhood}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          {address.street}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/dashboard/addresses/${address.id}/edit`)}
                            title="Edit address"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(address)}
                            disabled={deleteMutation.isPending}
                            title="Delete address"
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

      {!isLoading && filteredAddresses.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <p>
            Showing <span className="font-medium text-gray-900 dark:text-gray-100">{filteredAddresses.length}</span> of{' '}
            <span className="font-medium text-gray-900 dark:text-gray-100">{addresses.length}</span> addresses
          </p>
        </div>
      )}

      <DeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, address: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Address"
        description="Are you sure you want to delete this address? This action cannot be undone."
        itemName={deleteDialog.address ? `${deleteDialog.address.city}, ${deleteDialog.address.district}` : ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}


