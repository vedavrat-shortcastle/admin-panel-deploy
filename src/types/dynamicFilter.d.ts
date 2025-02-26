import { savedFilterSchema } from '@/schemas/savedFilterSchema';

export type FilterFieldType = 'string' | 'number' | 'date' | 'boolean';

export type FilterOperator =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'between'
  | 'in';

export interface FilterField {
  id: string;
  name: string;
  type: FilterFieldType;
  options?: string[];
  operators?: FilterOperator[];
}

export interface FilterCondition {
  fieldId: string;
  operator: FilterOperator;
  value: any;
}

export interface FilterGroup {
  logic: 'AND' | 'OR';
  conditions: FilterCondition[];
  groups?: FilterGroup[];
}

export type EntityFilter = {
  filter: FilterGroup;
  pagination?: {
    page: number;
    limit: number;
  };
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
};

export type FieldType = 'string' | 'number' | 'date' | 'boolean';

export type SavedFilter = z.infer<typeof savedFilterSchema>;
