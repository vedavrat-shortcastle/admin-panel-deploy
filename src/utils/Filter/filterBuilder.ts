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
  const conditions = filter.conditions.map((condition) => {
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
        return {
          AND: [
            { [fieldId]: { gte: value.min } },
            { [fieldId]: { lte: value.max } },
          ],
        };
      case 'in':
        return { [fieldId]: { in: value } };
      default:
        return {};
    }
  });

  const nestedGroups = filter.groups?.map(buildPrismaFilter) ?? [];
  const allConditions = [...conditions, ...nestedGroups];

  return allConditions.length > 0
    ? { [filter.logic.toLowerCase()]: allConditions }
    : {};
}
