import { Button } from '@/components/ui/button';
import {
  FilterCondition,
  FilterGroup,
  FilterOperator,
  FilterBuilderProps,
  SavedFilter,
} from '@/types/dynamicFilter';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SaveFilterDialog } from '@/components/dynamic-filter/SaveFilterDialog';
import { FilterConditions } from '@/components/dynamic-filter/FilterCondition';
import { trpc } from '@/utils/trpc';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

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
  const [isDirty, setIsDirty] = useState(false);
  const [savedFilters, setFilterTabs] = useState<SavedFilter[]>([]);
  const [activeFilterId, setActiveTabId] = useState<string | null>('new-tab');
  const { toast } = useToast();

  const { data, isLoading, error } = trpc.filter.getFilters.useQuery({
    sectionName: 'contacts', //TODO: Remove hardcoding of section across the file
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to get filters',
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (data && data.length > 0) {
      const combinedData: SavedFilter[] = data.map((item: any) => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      }));
      setFilterTabs(combinedData);
    }
  }, [data]);

  const createFilter = trpc.filter.createFilter.useMutation({
    onSuccess: (response) => {
      toast({ title: 'Success', description: 'Filter saved successfully' });
      setFilterTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeFilterId
            ? {
                filter: {
                  filter: response.filter.filter as unknown as FilterGroup,
                },
                id: response.filter.id,
                name: response.filter.name,
                createdAt: response.filter.createdAt
                  ? new Date(response.filter.createdAt)
                  : new Date(),
              }
            : tab
        )
      );
      setActiveTabId(response.filter.id);
      setIsDirty(false);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save filter',
      });
    },
  });

  const addFilterCondition = useCallback(() => {
    const newCondition: FilterCondition = {
      fieldId: fields[0].id,
      operator: 'equals' as FilterOperator,
      value: null,
    };

    setFilters((prev) => ({
      ...prev,
      conditions: [...prev.conditions, newCondition],
    }));
    setIsDirty(true);
  }, [fields]);

  const updateFilterCondition = useCallback(
    (index: number, field: string, value: any) => {
      setFilters((prev) => {
        const newConditions = [...prev.conditions];
        newConditions[index] = {
          ...newConditions[index],
          [field]: value,
        };
        return { ...prev, conditions: newConditions };
      });
      setIsDirty(true);
    },
    []
  );

  const removeFilterCondition = useCallback((index: number) => {
    setFilters((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
    setIsDirty(true);
  }, []);

  const handleLogicChange = useCallback((logic: 'AND' | 'OR') => {
    setFilters((prev) => ({ ...prev, logic }));
    setIsDirty(true);
  }, []);

  const saveFilter = useCallback(
    (name: string) => {
      createFilter.mutate({
        name,
        filter: filters,
        adminPanelSection: 'contacts',
      });
    },
    [createFilter, filters]
  );

  const applyFilters = useCallback(() => {
    onChange(filters);
    setIsDirty(false);
  }, [onChange, filters]);

  const handleClearFilters = useCallback(() => {
    setFilters(emptyFilters);
    onChange(emptyFilters);
    setIsDirty(false);
  }, [onChange]);

  const updateFilterMutation = trpc.filter.updateFilter.useMutation({
    onSuccess: () => {
      toast({ title: 'Success', description: 'Filter updated successfully' });
      onChange(filters);
      setFilterTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === activeFilterId
            ? { ...tab, filter: { filter: filters } }
            : tab
        )
      );
      setIsDirty(false);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update filter',
      });
    },
  });

  const deleteFilterMutation = trpc.filter.deleteFilter.useMutation({
    onSuccess: (_, { id }) => {
      toast({ title: 'Success', description: 'Filter deleted successfully' });
      setFilterTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));
      if (activeFilterId === id) {
        setActiveTabId(null);
        setFilters(emptyFilters);
        onChange(emptyFilters);
      }
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update filter',
      });
    },
  });

  const createNewFilter = useCallback(() => {
    const newTabId = 'new-tab';
    setFilterTabs((prev) => [
      {
        id: newTabId,
        name: 'New Tab',
        filter: { filter: emptyFilters },
        createdAt: new Date(),
      },
      ...prev,
    ]);
    setActiveTabId(newTabId);
    setFilters(emptyFilters);
  }, []);

  const updateFilter = useCallback(() => {
    const activeTab = savedFilters.find((tab) => tab.id === activeFilterId);
    if (!activeTab || !activeFilterId) return;

    updateFilterMutation.mutate({
      id: activeFilterId,
      name: activeTab.name,
      filter: { filter: filters },
    });
  }, [activeFilterId, savedFilters, filters, updateFilterMutation]);

  const deleteFilter = useCallback(
    (tabId: string) => {
      deleteFilterMutation.mutate({ id: tabId });
    },
    [deleteFilterMutation]
  );

  const selectFilter = useCallback(
    (tabId: string) => {
      if (activeFilterId === tabId) return;

      const selectedTab = savedFilters.find((tab) => tab.id === tabId);
      if (!selectedTab) return;

      setActiveTabId(tabId);
      const newFilters = (selectedTab.filter as { filter: FilterGroup }).filter;
      setFilters(newFilters);
      onChange(newFilters);
      setIsDirty(false);
    },
    [activeFilterId, savedFilters, onChange]
  );

  const filterConditions = useMemo(
    () =>
      filters.conditions.map((condition, index) => (
        <FilterConditions
          key={`${index}-${condition.fieldId}`}
          fields={fields}
          fieldId={condition.fieldId}
          operator={condition.operator}
          value={condition.value}
          onFieldChange={(fieldId) =>
            updateFilterCondition(index, 'fieldId', fieldId)
          }
          onOperatorChange={(operator) =>
            updateFilterCondition(index, 'operator', operator)
          }
          onValueChange={(value) =>
            updateFilterCondition(index, 'value', value)
          }
          onRemove={() => removeFilterCondition(index)}
        />
      )),
    [filters.conditions, fields, updateFilterCondition, removeFilterCondition]
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Filter Builder</h2>
        <div className="flex space-x-2">
          {activeFilterId !== 'new-tab' ? (
            <Button
              variant="secondary"
              disabled={!isDirty}
              onClick={updateFilter}
            >
              Update Filter
            </Button>
          ) : (
            <SaveFilterDialog onSave={saveFilter} />
          )}

          <Button
            variant="secondary"
            onClick={handleClearFilters}
            disabled={filters.conditions.length === 0}
          >
            Clear
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap max-w-full">
          {!savedFilters.some((tab) => tab.id === 'new-tab') && !isLoading && (
            <Button
              variant="ghost"
              disabled={activeFilterId === null}
              className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-sm"
              onClick={createNewFilter}
            >
              <Plus className="w-5 h-5" />
            </Button>
          )}

          {savedFilters.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center gap-3 h-9 pl-4 pr-1 rounded-sm cursor-pointer ${
                activeFilterId === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100'
              }`}
              onClick={() => selectFilter(tab.id)}
            >
              <span className="text-sm font-medium">{tab.name}</span>

              <Button
                variant="ghost"
                size="icon"
                className="p-0 m-0 hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFilter(tab.id);
                }}
              >
                ✕
              </Button>
            </div>
          ))}
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

          <div className="space-y-2">{filterConditions}</div>

          <div className="flex justify-between items-center pt-4">
            <Button onClick={addFilterCondition}>Add Condition</Button>
            <Button
              onClick={applyFilters}
              disabled={!isDirty}
              variant="default"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBuilder;
