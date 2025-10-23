import { Construction } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      </div>

      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <Construction className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Coming Soon</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                This module is under development and will be available soon.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
