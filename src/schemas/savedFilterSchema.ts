import { filterInputSchema } from '@/utils/Filter/filterBuilder';
import { z } from 'zod';

export const savedFilterSchema = z.object({
  name: z.string(),
  filter: filterInputSchema,
});
