import { z } from 'zod';

export const formSchema = z.object({
  firstName: z.string().min(1, { message: 'This field is required' }),
  lastName: z.string().min(1, { message: 'This field is required' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  academyIds: z.array(z.string()).min(1, { message: 'This field is requierd' }),
  adminUserName: z.number().min(1, { message: 'This field is required' }),
  totalPaidSeats: z.number().optional(),
  totalfreeSeats: z.number().optional(),
  planType: z.enum(['Monthly', 'Annual']),
  renewalType: z.enum(['Manual', 'Automatic']),
  planStartDate: z.date(),
  planEndDate: z.date(),
  salesType: z.array(z.string()).optional(),
  currency: z.array(z.string()).optional(),
  amount: z.number(),
  contactId: z.number().min(1, { message: 'This field is required' }),
  salesPerson: z.string(),
  status: z.enum([
    'new',
    'lead',
    'prospect',
    'customer',
    'churned',
    'high_prospect',
  ]),
  profilePhoto: z.instanceof(globalThis.File || Blob).optional(),
});
