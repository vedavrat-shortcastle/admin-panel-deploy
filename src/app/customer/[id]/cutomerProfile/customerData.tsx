export const initialSubscriptionData = {
  contactId: 123,
  academyId: 'academy-abc',
  adminName: 'Admin User',
  paidSeats: 10,
  freeSeats: 5,
  planType: 'MONTHLY',
  renewalType: 'AUTOMATIC',
  planStartDate: new Date(), // Current date
  planEndDate: new Date(
    new Date().getFullYear() + 1,
    new Date().getMonth(),
    new Date().getDate()
  ), // One year from now
  paymentMode: 1, // Example number for payment mode
  salesType: ['New'], // Example string array for sales type
  currency: ['USD'], // Example string array for currency
  amount: 100,
  salesPerson: 'John Doe',
  notes: 'Initial subscription setup.',
};
