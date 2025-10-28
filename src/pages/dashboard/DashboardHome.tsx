import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Car, DollarSign, ShoppingCart, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { carsApi } from '../../lib/api/cars';
import { salesApi } from '../../lib/api/sales';
import { customersApi } from '../../lib/api/customers';
import { galleristsApi } from '../../lib/api/gallerists';
import { formatCurrency } from '../../lib/utils/format';

export function DashboardHome() {
  const { data: cars = [] } = useQuery({ queryKey: ['cars'], queryFn: carsApi.getAll });
  const { data: sales = [] } = useQuery({ queryKey: ['sales'], queryFn: salesApi.getAll });
  const { data: customers = [] } = useQuery({ queryKey: ['customers'], queryFn: customersApi.getAll });
  const { data: gallerists = [] } = useQuery({ queryKey: ['gallerists'], queryFn: galleristsApi.getAll });

  const availableCars = cars.filter((car) => car.carStatusType === 'SALABLE').length;
  const soldCars = cars.filter((car) => car.carStatusType === 'SOLD').length;
  
  // Calculate revenue by currency type
  const totalRevenueTL = sales
    .filter((sale) => sale.car?.currencyType === 'TL')
    .reduce((acc, sale) => acc + (sale.car?.price || 0), 0);
  
  const totalRevenueUSD = sales
    .filter((sale) => sale.car?.currencyType === 'USD')
    .reduce((acc, sale) => acc + (sale.car?.price || 0), 0);

  const stats = [
    { title: 'Total Cars', value: cars.length, icon: Car, color: 'bg-blue-500' },
    { title: 'Available Cars', value: availableCars, icon: Car, color: 'bg-green-500' },
    { title: 'Sold This Month', value: soldCars, icon: ShoppingCart, color: 'bg-purple-500' },
    { 
      title: 'Total Revenue', 
      value: { tl: totalRevenueTL, usd: totalRevenueUSD }, 
      icon: DollarSign, 
      color: 'bg-amber-500',
      isRevenue: true
    },
    { title: 'Active Customers', value: customers.length, icon: Users, color: 'bg-indigo-500' },
    { title: 'Gallerists', value: gallerists.length, icon: Users, color: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="min-h-[4rem] flex items-center">
                  {stat.isRevenue ? (
                    <div className="space-y-1 w-full">
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency((stat.value as any).usd, 'USD')}
                      </div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {formatCurrency((stat.value as any).tl, 'TL')}
                      </div>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value as number}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {sales.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">No sales data available</p>
            ) : (
              <div className="space-y-4">
                {sales.slice(0, 5).map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {sale.car?.brand} {sale.car?.model}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{sale.customer?.firstName} {sale.customer?.lastName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(sale.car?.price || 0, sale.car?.currencyType || 'TL')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Cars</CardTitle>
          </CardHeader>
          <CardContent>
            {cars.filter(c => c.carStatusType === 'SALABLE').length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">No available cars</p>
            ) : (
              <div className="space-y-4">
                {cars.filter(c => c.carStatusType === 'SALABLE').slice(0, 5).map((car) => (
                  <div key={car.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {car.brand} {car.model}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{car.plate} • {car.productionYear}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(car.price, car.currencyType)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
