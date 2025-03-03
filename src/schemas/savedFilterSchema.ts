import { filterInputSchema } from '@/utils/Filter/filterBuilder';
import { z } from 'zod';

export const savedFilterSchema = filterInputSchema.extend({
  name: z.string(),
<<<<<<< HEAD
  adminpanelSection: z.string(),
=======
  adminPanelSection: z.string(),
>>>>>>> 9ce9ff48f1172a85acb968b33439ef2f2f20d3a4
});
