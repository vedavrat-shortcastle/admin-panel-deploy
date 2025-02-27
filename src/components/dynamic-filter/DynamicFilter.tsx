import { Button } from '@/components/ui/button';
import {
  FilterCondition,
  FilterGroup,
  FilterOperator,
  FilterBuilderProps,
  FilterTab,
} from '@/types/dynamicFilter';
import React, { useState, useEffect } from 'react';
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
  const [savedFilters, setFilterTabs] = useState<FilterTab[]>([]);
  const [activeFilterId, setActiveTabId] = useState<string | null>('new-tab');
  const { toast } = useToast();

  const { data, isLoading, error } = trpc.filter.getFilters.useQuery({
    sectionName: 'contacts',
  });

  if (error) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: error.message || 'Failed to get filters',
    });
  }

  useEffect(() => {
    if (data && data.length > 0) {
      const combinedData = data.map((item) => ({
        ...item,
        createdat: item.createdat ? new Date(item.createdat) : new Date(),
      }));
      setFilterTabs(combinedData);
    }
  }, [data]);

  const createFilter = trpc.filter.createFilter.useMutation({
    onSuccess: async (response) => {
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
                createdat: response.filter.createdat
                  ? new Date(response.filter.createdat)
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

  const updateFilters = (newFilters: FilterGroup) => {
    setFilters(newFilters);
    setIsDirty(true);
  };

  const addFilterCondition = () => {
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

  const updateFilterCondition = (index: number, field: string, value: any) => {
    const newConditions = [...filters.conditions];
    newConditions[index] = {
      ...newConditions[index],
      [field]: value,
    };
    updateFilters({ ...filters, conditions: newConditions });
  };

  const removeFilterCondition = (index: number) => {
    updateFilters({
      ...filters,
      conditions: filters.conditions.filter((_, i) => i !== index),
    });
  };

  const handleLogicChange = (logic: 'AND' | 'OR') => {
    updateFilters({ ...filters, logic });
  };

  const saveFilter = (name: string) => {
    createFilter.mutate({
      name,
      filter: filters,
      adminpanelSection: 'contacts',
    });
  };

  const applyFilters = () => {
    onChange(filters);
    setIsDirty(false);
  };

  const handleClearFilters = () => {
    setFilters(emptyFilters);
    onChange(emptyFilters);
    setIsDirty(false);
  };

  const updateFilterMutation = trpc.filter.updateFilter.useMutation({
    onSuccess: async () => {
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
    onSuccess: async (_, { id }) => {
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
        description: error.message || 'Failed to delete filter',
      });
    },
  });

  const createNewFilter = () => {
    const newTabId = 'new-tab';
    setFilterTabs([
      {
        id: newTabId,
        name: 'New Tab',
        filter: { filter: emptyFilters },
        createdat: new Date(),
      },
      ...savedFilters,
    ]);
    setActiveTabId(newTabId);
    setFilters(emptyFilters);
  };

  const updateFilter = () => {
    const activeTab = savedFilters.find((tab) => tab.id === activeFilterId);

    updateFilterMutation.mutate({
      id: activeFilterId || '',
      name: (activeTab && activeTab.name) || '',
      filter: { filter: filters },
    });
  };

  const deleteFilter = (tabId: string) => {
    deleteFilterMutation.mutate({ id: tabId });
  };

  const selectFilter = (tabId: string) => {
    if (activeFilterId === tabId) return;
    const selectedTab = savedFilters.find((tab) => tab.id === tabId);
    if (!selectedTab) return;

    setActiveTabId(tabId);
    setFilters((selectedTab.filter as { filter: FilterGroup }).filter);
    onChange((selectedTab.filter as { filter: FilterGroup }).filter);
    setIsDirty(false);
  };

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
                  e.stopPropagation(); // Prevent clicking tab when deleting
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

          <div className="space-y-2">
            {filters.conditions.map((condition, index) => {
              return (
                <FilterConditions
                  key={index}
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
              );
            })}
          </div>

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
