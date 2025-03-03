// This function manages the search conditions in the filter group.
// It ensures that each new search term replaces any previous search conditions,

import { FilterGroup, FilterOperator } from '@/types/dynamicFilter';

export function addSearchConditions(
  filter: FilterGroup,
  searchFields: string[],

  searchTerm: string
): FilterGroup {
  function isSearchGroup(group: FilterGroup): boolean {
    return (
      group.logic === 'OR' &&
      group.conditions.every((cond) => {
        return (
          searchFields.includes(cond.fieldId) && cond.operator === 'contains'
        );
      })
    );
  }

  if (searchTerm === '') {
    // If the search term is empty, remove any existing search group from the filter's groups.
    // This ensures that no search conditions are applied when the search input is cleared.
    const newGroups = (filter.groups || []).filter(
      (group) => !isSearchGroup(group)
    );
    return {
      ...filter,
      groups: newGroups,
    };
  } else {
    const searchConditions = searchFields.map((field) => ({
      fieldId: field,
      operator: 'contains' as FilterOperator,
      value: searchTerm,
    }));

    // Create a new group to hold these search conditions with 'OR' logic.
    // This group will match if any of the fields contain the search term.
    const newSearchGroup: FilterGroup = {
      logic: 'OR',
      conditions: searchConditions,
      groups: [],
    };

    // Check if there is already a search group in the filter's groups.
    const existingSearchGroupIndex = (filter.groups || []).findIndex(
      isSearchGroup
    );

    let newGroups: FilterGroup['groups'] = [];

    if (existingSearchGroupIndex !== -1) {
      // If an existing search group is found, replace it with the new search group.
      // This ensures that the search conditions are updated to reflect the current search term.
      newGroups = [
        ...(filter.groups || []).slice(0, existingSearchGroupIndex),
        newSearchGroup,
        ...(filter.groups || []).slice(existingSearchGroupIndex + 1),
      ];
    } else {
      // If no existing search group is found, add the new search group to the filter's groups.
      // This handles the case when there was no previous search or the previous search group was removed.
      newGroups = [...(filter.groups || []), newSearchGroup];
    }

    // Return the updated filter with the new groups.
    // The rest of the filter remains unchanged except for the groups array.
    return {
      ...filter,
      groups: newGroups,
    };
  }
}
