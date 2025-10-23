import { NavLink } from 'react-router-dom';
import { Car, LayoutDashboard, Users, UserCircle, ShoppingCart, Wallet, MapPin, Package, BarChart3, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '../../lib/utils/cn';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/cars', icon: Car, label: 'Cars' },
  { to: '/dashboard/gallerists', icon: Users, label: 'Gallerists' },
  { to: '/dashboard/customers', icon: UserCircle, label: 'Customers' },
  { to: '/dashboard/sales', icon: ShoppingCart, label: 'Sales' },
  { to: '/dashboard/inventory', icon: Package, label: 'Inventory' },
  { to: '/dashboard/accounts', icon: Wallet, label: 'Accounts' },
  { to: '/dashboard/addresses', icon: MapPin, label: 'Addresses' },
  { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/dashboard/settings', icon: SettingsIcon, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Car className="h-8 w-8" />
          <span className="text-2xl font-bold">Gallerist</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                'hover:bg-indigo-50 dark:hover:bg-gray-800',
                isActive
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 font-medium'
                  : 'text-gray-700 dark:text-gray-300'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
