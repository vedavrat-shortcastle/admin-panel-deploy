import { FilterValueInput } from '@/components/dynamic-filter/FilterValueInput';
import { SaveFilterDialog } from '@/components/dynamic-filter/SaveFilterDialog';
import { FilterField, FilterGroup } from '@/types/dynamicFilter';
import React, { useState } from 'react';

interface FilterBuilderProps {
  fields: FilterField[];
  initialFilters?: FilterGroup;
  onChange: (filters: FilterGroup) => void;
}

export const FilterBuilder: React.FC<FilterBuilderProps> = ({
  fields,
  initialFilters,
  onChange,
}) => {
  const [filters, setFilters] = useState<FilterGroup>(
    () =>
      initialFilters || {
        id: 'root',
        logic: 'AND',
        conditions: [],
        groups: [],
      }
  );

  const handleChange = (newFilters: FilterGroup) => {
    setFilters(newFilters);
    onChange(newFilters);
  };

  const handleSaveFilter = (name: string) => {
    // Save to localStorage or your backend
    const savedFilters = JSON.parse(
      localStorage.getItem('savedFilters') || '{}'
    );
    savedFilters[name] = filters;
    localStorage.setItem('savedFilters', JSON.stringify(savedFilters));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Filter Builder</h2>
        <SaveFilterDialog onSave={handleSaveFilter} />
      </div>
      <FilterValueInput
        group={filters}
        fields={fields}
        onChange={handleChange}
        level={0}
      />
    </div>
  );
};
