import { formSchema } from '@/schemas/contacts';
import { z } from 'zod';

export type ContactsTable = {
  firstname: string;
  lastname: string;
  email: string;
  role: 'Coach' | 'Subcoach' | 'Admin';
  title: 'GM' | 'IM' | 'FM' | 'CM' | 'NM';
  status: 'active' | 'lead' | 'churned' | 'prospect' | 'new';
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
