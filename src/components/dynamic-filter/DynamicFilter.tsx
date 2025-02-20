import { Button } from '@/components/ui/button';
import {
  FilterCondition,
  FilterField,
  FilterGroup,
  FilterOperator,
} from '@/types/dynamicFilter';
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SaveFilterDialog } from '@/components/dynamic-filter/SaveFilterDialog';
import { FilterConditions } from '@/components/dynamic-filter/FilterCondition';

interface FilterBuilderProps {
  fields: FilterField[];
  initialFilters?: FilterGroup;
  onChange: (filters: FilterGroup) => void;
}

const emptyFilters: FilterGroup = {
  logic: 'AND',
  conditions: [],
  groups: [],
};

export const FilterBuilder: React.FC<FilterBuilderProps> = ({
  fields,
  initialFilters,
  onChange,
}) => {
  const [filters, setFilters] = useState<FilterGroup>(
    () => initialFilters || emptyFilters
  );

  // Track if filters have been modified
  const [isDirty, setIsDirty] = useState(false);

  const updateFilters = (newFilters: FilterGroup) => {
    setFilters(newFilters);
    setIsDirty(true);
  };

  const handleAddCondition = () => {
    const newCondition: FilterCondition = {
      fieldId: fields[0].id,
      operator: 'equals' as FilterOperator,
      value: null,
    };

    updateFilters({
      ...filters,
      conditions: [...filters.conditions, newCondition],
    });
  };

  const handleConditionChange = (index: number, field: string, value: any) => {
    const newConditions = [...filters.conditions];
    newConditions[index] = {
      ...newConditions[index],
      [field]: value,
    };
    updateFilters({ ...filters, conditions: newConditions });
  };

  const handleRemoveCondition = (index: number) => {
    updateFilters({
      ...filters,
      conditions: filters.conditions.filter((_, i) => i !== index),
    });
  };

  const handleLogicChange = (logic: 'AND' | 'OR') => {
    updateFilters({ ...filters, logic });
  };

  const handleSaveFilter = (name: string) => {
    const savedFilters = JSON.parse(
      localStorage.getItem('savedFilters') || '{}'
    );
    savedFilters[name] = filters;
    localStorage.setItem('savedFilters', JSON.stringify(savedFilters));
  };

  const handleApplyFilters = () => {
    onChange(filters);
    setIsDirty(false);
  };

  const handleClearFilters = () => {
    setFilters(emptyFilters);
    onChange(emptyFilters);
    setIsDirty(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Filter Builder</h2>
        <div className="flex space-x-2">
          <SaveFilterDialog onSave={handleSaveFilter} />
          <Button
            variant="secondary"
            onClick={handleClearFilters}
            disabled={filters.conditions.length === 0}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="space-y-4 p-4 border rounded-lg">
        <div className="flex items-center space-x-2">
          <span>Match</span>
          <Select value={filters.logic} onValueChange={handleLogicChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">ALL</SelectItem>
              <SelectItem value="OR">ANY</SelectItem>
            </SelectContent>
          </Select>
          <span>of the following conditions:</span>
        </div>

        <div className="space-y-2">
          {filters.conditions.map((condition, index) => (
            <FilterConditions
              key={index}
              fields={fields}
              fieldId={condition.fieldId}
              operator={condition.operator}
              value={condition.value}
              onFieldChange={(fieldId) =>
                handleConditionChange(index, 'fieldId', fieldId)
              }
              onOperatorChange={(operator) =>
                handleConditionChange(index, 'operator', operator)
              }
              onValueChange={(value) =>
                handleConditionChange(index, 'value', value)
              }
              onRemove={() => handleRemoveCondition(index)}
            />
          ))}
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button onClick={handleAddCondition}>Add Condition</Button>
          <Button
            onClick={handleApplyFilters}
            disabled={!isDirty}
            variant="default"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
