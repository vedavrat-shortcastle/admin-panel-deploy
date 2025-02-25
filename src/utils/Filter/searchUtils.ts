import { FilterGroup, FilterOperator } from '@/types/dynamicFilter';

export function addSearchConditions(
  filter: FilterGroup,
  searchFields: string[],
  searchTerm: string
): FilterGroup {
  const searchConditions = searchFields.map((field) => ({
    fieldId: field,
    operator: 'contains' as FilterOperator,
    value: searchTerm,
  }));

  return {
    ...filter,
    groups: [
      ...(filter.groups || []),
      {
        logic: 'OR',
        conditions: searchConditions,
      },
    ],
  };
}
