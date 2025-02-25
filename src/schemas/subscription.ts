import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  contactId: z.number(),
  academyId: z.string(),
  adminName: z.string().max(100).optional(),
  paidSeats: z.number().int().optional(),
  freeSeats: z.number().int().optional(),
  planType: z.enum(['MONTHLY', 'ANNUAL']).default('MONTHLY'),
  renewalType: z.enum(['MANUAL', 'AUTOMATIC']).default('AUTOMATIC'),
  planStartDate: z.date(),
  planEndDate: z.date(),
  salesType: z
    .enum(['UPSELL', 'NEW', 'RENEWAL', 'ONETIME', 'LIFETIME'])
    .default('NEW'),
  notes: z.string().optional(),
  salesPerson: z.string().max(100).optional(),
  paymentMode: z.enum([
    'stripeSingapore',
    'stripeCanada',
    'stripeUS',
    'razorpayIndia',
    'gPay',
    'bankTransfer',
    'other',
  ]),
  currency: z.enum(['CAD', 'EUR', 'INR', 'USD']),
  amount: z.number().int().optional(),
});
