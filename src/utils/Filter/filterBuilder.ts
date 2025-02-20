import { FilterGroup } from '@/types/dynamicFilter';
import { z } from 'zod';

type WhereInput = {
  AND?: Array<WhereInput>;
  OR?: Array<WhereInput>;
  [key: string]: any;
};

export const filterInputSchema = z.object({
  filter: z.object({
    logic: z.enum(['AND', 'OR']),
    conditions: z.array(
      z.object({
        fieldId: z.string(),
        operator: z.string(),
        value: z.any(),
      })
    ),
    groups: z.array(z.any()).optional(),
  }),
  pagination: z
    .object({
      page: z.number(),
      limit: z.number(),
    })
    .optional(),
  sort: z
    .object({
      field: z.string(),
      direction: z.enum(['asc', 'desc']),
    })
    .optional(),
});

export function buildPrismaFilter(filter: FilterGroup): WhereInput {
  if (!filter.conditions.length && (!filter.groups || !filter.groups.length)) {
    return {};
  }

  const conditions = filter.conditions
    .filter(
      (condition) => condition.value !== null && condition.value !== undefined
    )
    .map((condition) => {
      const { fieldId, operator, value } = condition;

      switch (operator) {
        case 'equals':
          return { [fieldId]: { equals: value } };
        case 'contains':
          return { [fieldId]: { contains: value, mode: 'insensitive' } };
        case 'startsWith':
          return { [fieldId]: { startsWith: value } };
        case 'endsWith':
          return { [fieldId]: { endsWith: value } };
        case 'greaterThan':
          return { [fieldId]: { gt: value } };
        case 'lessThan':
          return { [fieldId]: { lt: value } };
        case 'between':
          if (value?.min !== undefined && value?.max !== undefined) {
            return {
              AND: [
                { [fieldId]: { gte: value.min } },
                { [fieldId]: { lte: value.max } },
              ],
            };
          }
          return null;
        case 'in':
          return { [fieldId]: { in: Array.isArray(value) ? value : [value] } };
        default:
          return null;
      }
    })
    .filter(Boolean);

  const nestedGroups =
    filter.groups
      ?.map(buildPrismaFilter)
      .filter((group) => Object.keys(group).length > 0) ?? [];

  const allConditions = [...conditions, ...nestedGroups];

  if (!allConditions.length) {
    return {};
  }

  // For single condition, return it directly without wrapping in AND/OR
  if (allConditions.length === 1) {
    return allConditions[0] as WhereInput;
  }

  return {
    [filter.logic.toLowerCase()]: allConditions,
  };
}
