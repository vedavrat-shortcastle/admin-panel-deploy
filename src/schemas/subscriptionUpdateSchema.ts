import { z } from 'zod';

export const subscriptionUpdateSchema = z.object({
  contactId: z.number().optional(),
  academyId: z.string().optional(),
  adminName: z.string().max(100).optional(),
  paidSeats: z.number().int().optional(),
  freeSeats: z.number().int().optional(),
  planType: z.enum(['MONTHLY', 'ANNUAL']).optional(),
  renewalType: z.enum(['MANUAL', 'AUTOMATIC']).optional(),
  planStartDate: z.date().optional(),
  planEndDate: z.date().optional(),
  salesType: z
    .enum(['UPSELL', 'NEW', 'RENEWAL', 'ONETIME', 'LIFETIME'])
    .default('NEW'),
  notes: z.string().optional(),
  salesPerson: z.string().max(100).optional(),
  paymentMode: z
    .enum([
      'stripeSingapore',
      'stripeCanada',
      'stripeUS',
      'razorpayIndia',
      'gPay',
      'bankTransfer',
      'other',
    ])
    .optional(),
  currency: z.enum(['CAD', 'EUR', 'INR', 'USD']).optional(),
  amount: z.number().int().optional(),
});
