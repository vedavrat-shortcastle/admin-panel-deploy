export const initialSubscriptionData = {
  contactId: 123,
  academyId: 'academy-abc',
  adminName: 'Admin User',
  paidSeats: 10,
  freeSeats: 5,
  planType: 'MONTHLY',
  renewalType: 'AUTOMATIC',
  planStartDate: new Date(),
  planEndDate: new Date(
    new Date().getFullYear() + 1,
    new Date().getMonth(),
    new Date().getDate()
  ),
  paymentMode: 1,
  salesType: ['New'],
  currency: ['USD'],
  amount: 100,
  salesPerson: 'John Doe',
  notes: 'Initial subscription setup.',
};
