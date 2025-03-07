'use client';

import { useState } from 'react';
import { ArrowDownAZ, ArrowUpZA } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sortFields } from '@/utils/sortEntities';

interface SortComponentProps {
  onSortChange: (field: string, direction: 'asc' | 'desc') => void;
}

export default function DynamicSort({ onSortChange }: SortComponentProps) {
  const [sortField, setSortField] = useState('firstName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleFieldChange = (value: string) => {
    setSortField(value);
    onSortChange(value, sortDirection);
  };

  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    onSortChange(sortField, newDirection);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={sortField} onValueChange={handleFieldChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue>
            {sortFields.find((opt) => opt.id === sortField)?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {sortFields.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={toggleSortDirection} variant="ghost">
        {sortDirection === 'asc' ? (
          <ArrowDownAZ size={22} />
        ) : (
          <ArrowUpZA size={22} />
        )}
      </Button>
    </div>
  );
}
