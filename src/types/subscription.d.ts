import {
  PlanType,
  RenewalType,
  SalesType,
  PaymentMode,
  Currency,
  ContactAcademy,
} from '@prisma/client';

export interface Subscription {
  id: number;
  contactId: number;
  academyId?: string;
  academies?: ContactAcademy[];
  adminName?: string;
  paidSeats?: number;
  freeSeats?: number;
  planType: PlanType;
  renewalType: RenewalType;
  planStartDate: Date; // Changed to Date
  planEndDate: Date; // Changed to Date
  paymentMode: PaymentMode;
  salesType: SalesType;
  currency: Currency;
  amount?: number;
  salesPerson?: string;
  notes?: string;
  academy: {
    name: string;
  };
}
