import { FieldType, FilterOperator } from '@/types/dynamicFilter';

export const OPERATOR_BY_TYPE: Record<FieldType, FilterOperator[]> = {
  string: ['equals', 'contains', 'startsWith', 'endsWith', 'in'],
  number: ['equals', 'greaterThan', 'lessThan', 'between'],
  date: ['equals', 'greaterThan', 'lessThan', 'between'],
  boolean: ['equals'],
};

export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  equals: 'Equals',
  contains: 'Contains',
  startsWith: 'Starts with',
  endsWith: 'Ends with',
  greaterThan: 'Greater than',
  lessThan: 'Less than',
  between: 'Between',
  in: 'In',
};
