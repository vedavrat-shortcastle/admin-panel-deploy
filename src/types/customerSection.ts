import { createSubscriptionSchema } from '@/schemas/subscription';
import { SalesType } from '@prisma/client';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export type CustomerTable = {
  contact: {
    email: string | null;
    firstName: string | null;
    lastName: string | null;
  };
  academy: { name: string };
  salesType: string;
};

export type SubscriptionView = {
  academy: {
    name: string;
  };
  salesType: SalesType;
  planEndDate?: Date;
};

export type subscriptionFormValues = z.infer<typeof createSubscriptionSchema>;

export type subscriptionFormReturns = UseFormReturn<any>;
