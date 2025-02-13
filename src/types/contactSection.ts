import { formSchema } from '@/schemas/contacts';
import { ChessTitle, ContactRole, ContactStatus } from '@prisma/client';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export type ContactsTable = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: ContactRole | null;
  titles: ChessTitle | null;
  currentStatus: ContactStatus | null;
};

export type Academy = {
  id: string;
  name: string;
  shortName: string;
  timezone: string;
  domain: string;
  createdAt: Date;
};

export type FormValues = z.infer<typeof formSchema>;

export type ContactFormReturn = UseFormReturn<any>;
