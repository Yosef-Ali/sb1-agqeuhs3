'use client';

import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export function ProductFilters() {
  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-4">Filters</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Categories</h3>
          <div className="space-y-2">
            {['Fruits', 'Berries', 'Citrus', 'Tropical'].map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox id={category} />
                <Label htmlFor={category}>{category}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}