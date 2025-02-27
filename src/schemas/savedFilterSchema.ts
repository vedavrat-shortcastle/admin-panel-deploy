import { filterInputSchema } from '@/utils/Filter/filterBuilder';
import { z } from 'zod';

export const savedFilterSchema = filterInputSchema.extend({
  name: z.string(),
});
