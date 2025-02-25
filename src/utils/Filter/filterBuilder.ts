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

function validatePrismaFilter(
  filter: WhereInput,
  logError: boolean = true
): boolean {
  if (typeof filter !== 'object' || filter === null) {
    if (logError) console.error('Filter is not an object or is null:', filter);
    return false;
  }

  // Add mode as a valid operator property
  const validProperties = [
    'equals',
    'contains',
    'startsWith',
    'endsWith',
    'gt',
    'lt',
    'gte',
    'lte',
    'in',
    'mode', // Add this to allow the mode property
  ];

  const validateCondition = (condition: any): boolean => {
    if (typeof condition !== 'object' || condition === null) {
      if (logError)
        console.error('Condition is not an object or is null:', condition);
      return false;
    }

    for (const key in condition) {
      if (key === 'AND' || key === 'OR') {
        if (!Array.isArray(condition[key])) {
          if (logError)
            console.error(`Condition ${key} is not an array:`, condition[key]);
          return false;
        }
        if (
          !condition[key].every((subCondition: any) =>
            validateCondition(subCondition)
          )
        ) {
          if (logError)
            console.error(
              `Condition ${key} has invalid sub-conditions:`,
              condition[key]
            );
          return false;
        }
      } else {
        const operatorObject = condition[key];
        if (typeof operatorObject !== 'object' || operatorObject === null) {
          if (logError)
            console.error(
              'Operator object is not an object or is null:',
              operatorObject
            );
          return false;
        }
        for (const operator in operatorObject) {
          if (!validProperties.includes(operator)) {
            if (logError) console.error('Invalid operator:', operator);
            return false;
          }
        }
      }
    }
    return true;
  };

  const isValid = validateCondition(filter);
  if (!isValid && logError) {
    console.error('Invalid filter structure:', JSON.stringify(filter, null, 2));
  }
  return isValid;
}

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
    const singleCondition = allConditions[0] as WhereInput;
    if (!validatePrismaFilter(singleCondition, false)) {
      throw new Error('Invalid filter conditions');
    }
    return singleCondition;
  }

  const prismaFilter = {
    [filter.logic.toUpperCase()]: allConditions,
  };

  if (!validatePrismaFilter(prismaFilter)) {
    throw new Error('Invalid filter conditions');
  }

  return prismaFilter;
}
