import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, RefreshCw, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { currencyRatesApi } from '../../lib/api/currency-rates';
import { Label } from '../../components/ui/label';

export function CurrencyRatesPage() {
  const today = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [queryParams, setQueryParams] = useState({ startDate: today, endDate: today });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['currency-rates', queryParams],
    queryFn: () => currencyRatesApi.getCurrencyRates(queryParams),
  });

  const currencyRates = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const handleSearch = () => {
    setQueryParams({ startDate: selectedDate, endDate: selectedDate });
  };

  const handleRefresh = () => {
    refetch();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const [day, month, year] = dateString.split('-');
      return `${day}.${month}.${year}`;
    } catch {
      return dateString;
    }
  };

  const formatRate = (rate: string) => {
    try {
      return parseFloat(rate).toFixed(4);
    } catch {
      return rate;
    }
  };

  const getLatestRate = () => {
    if (currencyRates.length > 0) {
      return currencyRates[currencyRates.length - 1];
    }
    return null;
  };

  const getPreviousRate = () => {
    if (currencyRates.length > 1) {
      return currencyRates[currencyRates.length - 2];
    }
    return null;
  };

  const calculateChange = () => {
    const latest = getLatestRate();
    const previous = getPreviousRate();
    
    if (!latest || !previous) return null;
    
    const latestValue = parseFloat(latest.usd);
    const previousValue = parseFloat(previous.usd);
    const change = latestValue - previousValue;
    const changePercent = (change / previousValue) * 100;
    
    return {
      change,
      changePercent,
      isPositive: change >= 0,
    };
  };

  const changeData = calculateChange();
  const latestRate = getLatestRate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Currency Rates</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Check USD to TRY exchange rate for a specific date from TCMB
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Latest Rate Card */}
      {latestRate && (
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 border-indigo-200 dark:border-indigo-800">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current USD Rate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    ₺{formatRate(latestRate.usd)}
                  </span>
                  <span className="text-lg text-gray-600 dark:text-gray-400">TRY</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  {formatDate(latestRate.date)}
                </p>
              </div>
              <div className="text-right">
                {changeData && (
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        changeData.isPositive
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      }
                    >
                      <TrendingUp className={`h-3 w-3 mr-1 ${!changeData.isPositive ? 'rotate-180' : ''}`} />
                      {changeData.isPositive ? '+' : ''}
                      {changeData.change.toFixed(4)} ({changeData.changePercent.toFixed(2)}%)
                    </Badge>
                  </div>
                )}
                <DollarSign className="h-16 w-16 text-indigo-300 dark:text-indigo-700 mt-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Date Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="selectedDate" className="mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Select Date
              </Label>
              <Input
                id="selectedDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={today}
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading} className="gap-2">
              <Calendar className="h-4 w-4" />
              Get Rate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading currency rates...</p>
            </div>
          ) : currencyRates.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                No rate found
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Try selecting a different date
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      USD Rate (TRY)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currencyRates.map((rate, index) => (
                    <tr
                      key={`${rate.date}-${index}`}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {formatDate(rate.date)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          ₺{formatRate(rate.usd)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {!isLoading && currencyRates.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <p>
            Showing <span className="font-medium text-gray-900 dark:text-gray-100">{currencyRates.length}</span> rates
            {totalCount > 0 && (
              <>
                {' '}of <span className="font-medium text-gray-900 dark:text-gray-100">{totalCount}</span> total
              </>
            )}
          </p>
          <p className="text-xs">
            Data source: <span className="font-medium">TCMB EVDS</span>
          </p>
        </div>
      )}
    </div>
  );
}

