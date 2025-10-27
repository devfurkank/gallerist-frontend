import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Car as CarIcon, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { inventoryApi } from '../../lib/api/inventory';
import { formatCurrency } from '../../lib/utils/format';
import type { GalleristCar } from '../../lib/types';

export function InventoryListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: inventoryApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: inventoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Car assignment deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete car assignment');
    },
  });

  const filteredInventory = inventory.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.car?.plate?.toLowerCase().includes(searchLower) ||
      item.car?.brand?.toLowerCase().includes(searchLower) ||
      item.car?.model?.toLowerCase().includes(searchLower) ||
      item.gallerist?.firstName?.toLowerCase().includes(searchLower) ||
      item.gallerist?.lastName?.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this car assignment?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Inventory</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage car assignments to gallerists</p>
        </div>
        <Button onClick={() => navigate('/dashboard/inventory/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Assign Car
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by car, gallerist name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredInventory.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {search ? 'No matching assignments found' : 'No car assignments yet'}
            </p>
            <Button 
              onClick={() => navigate('/dashboard/inventory/new')} 
              className="mt-4 gap-2"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              Create First Assignment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventory.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CarIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    {item.car?.brand} {item.car?.model}
                  </CardTitle>
                  <Badge variant={item.car?.carStatusType === 'SALABLE' ? 'success' : 'secondary'}>
                    {item.car?.carStatusType || 'N/A'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Plate:</span>
                    <span className="text-gray-900 dark:text-gray-100">{item.car?.plate || 'N/A'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900 dark:text-gray-100">
                      {item.gallerist?.firstName} {item.gallerist?.lastName}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Price: </span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {formatCurrency(item.car?.price || 0, item.car?.currencyType || 'TRY')}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Year: {item.car?.productionYear || 'N/A'}
                    </div>
                  </div>

                  {item.createTime && (
                    <div className="text-xs text-gray-500">
                      Assigned: {new Date(item.createTime).toLocaleDateString()}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/dashboard/inventory/${item.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

