import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { DeleteDialog } from '../../components/ui/delete-dialog';
import { galleristsApi } from '../../lib/api/gallerists';
import type { Gallerist } from '../../lib/types';

export function GalleristsListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; gallerist: Gallerist | null }>({
    open: false,
    gallerist: null,
  });

  const { data: gallerists = [], isLoading } = useQuery({
    queryKey: ['gallerists'],
    queryFn: galleristsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: galleristsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallerists'] });
      toast.success('Gallerist deleted successfully');
      setDeleteDialog({ open: false, gallerist: null });
    },
    onError: () => {
      toast.error('Failed to delete gallerist');
      setDeleteDialog({ open: false, gallerist: null });
    },
  });

  const filteredGallerists = gallerists.filter(
    (gallerist) =>
      gallerist.firstName.toLowerCase().includes(search.toLowerCase()) ||
      gallerist.lastName.toLowerCase().includes(search.toLowerCase()) ||
      gallerist.address?.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (gallerist: Gallerist) => {
    setDeleteDialog({ open: true, gallerist });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.gallerist) {
      deleteMutation.mutate(deleteDialog.gallerist.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gallerists</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage gallerists</p>
        </div>
        <Button onClick={() => navigate('/dashboard/gallerists/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Gallerist
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or city..."
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
      ) : filteredGallerists.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">No gallerists found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallerists.map((gallerist) => (
            <Card key={gallerist.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {gallerist.firstName} {gallerist.lastName}
                    </CardTitle>
                    {gallerist.address && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-3 w-3" />
                        <span>{gallerist.address.city}, {gallerist.address.district}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {gallerist.address && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>{gallerist.address.neighborhood}</p>
                      <p>{gallerist.address.street}</p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/dashboard/gallerists/${gallerist.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(gallerist)}
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
        onOpenChange={(open) => setDeleteDialog({ open, gallerist: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Gallerist"
        description="Are you sure you want to delete this gallerist? This action cannot be undone."
        itemName={deleteDialog.gallerist ? `${deleteDialog.gallerist.firstName} ${deleteDialog.gallerist.lastName}` : ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

