import { subscriptionFormValues } from '@/schemas/subscription';

export const subscriptionFormDefaults: subscriptionFormValues = {
  contactId: 0, // Placeholder, replace with actual ID
  academyId: '',
  adminName: '',
  paidSeats: 0,
  freeSeats: 0,
  planType: 'MONTHLY',
  renewalType: 'AUTOMATIC',
  planStartDate: new Date(),
  planEndDate: new Date(),
  salesType: 'NEW',
  notes: '',
  salesPerson: '',
  paymentMode: 'other',
  currency: 'USD',
  amount: 0,
};
