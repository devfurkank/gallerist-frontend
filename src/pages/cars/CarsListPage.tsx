import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { DeleteDialog } from '../../components/ui/delete-dialog';
import { carsApi } from '../../lib/api/cars';
import { formatCurrency } from '../../lib/utils/format';
import type { Car } from '../../lib/types';

export function CarsListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; car: Car | null }>({
    open: false,
    car: null,
  });

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ['cars'],
    queryFn: carsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: carsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      toast.success('Car deleted successfully');
      setDeleteDialog({ open: false, car: null });
    },
    onError: () => {
      toast.error('Failed to delete car');
      setDeleteDialog({ open: false, car: null });
    },
  });

  const filteredCars = cars.filter(
    (car) =>
      car.plate.toLowerCase().includes(search.toLowerCase()) ||
      car.brand.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (car: Car) => {
    setDeleteDialog({ open: true, car });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.car) {
      deleteMutation.mutate(deleteDialog.car.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Cars</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your car inventory</p>
        </div>
        <Button onClick={() => navigate('/dashboard/cars/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Car
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by plate, brand, or model..."
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
                <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCars.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">No cars found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <Card key={car.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/dashboard/cars/${car.id}`)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{car.brand} {car.model}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{car.plate}</p>
                  </div>
                  <Badge variant={car.carStatusType === 'SALABLE' ? 'success' : 'secondary'}>
                    {car.carStatusType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Year</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{car.productionYear}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Price</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(car.price, car.currencyType)}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/cars/${car.id}/edit`);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(car);
                      }}
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

      <DeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, car: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Car"
        description="Are you sure you want to delete this car? This action cannot be undone."
        itemName={deleteDialog.car ? `${deleteDialog.car.brand} ${deleteDialog.car.model} (${deleteDialog.car.plate})` : ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
