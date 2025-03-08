'use server';
import { FilterField } from '@/types/dynamicFilter';
import { ContactRole, ContactStatus } from '@prisma/client';

export const contactFilterFields: FilterField[] = [
  {
    id: 'firstName',
    name: 'First Name',
    type: 'string',
    operators: ['equals', 'contains', 'startsWith'],
  },
  {
    id: 'lastName',
    name: 'Last Name',
    type: 'string',
    operators: ['equals', 'contains', 'startsWith'],
  },
  {
    id: 'email',
    name: 'Email',
    type: 'string',
    operators: ['equals', 'contains'],
  },
  {
    id: 'role',
    name: 'Role',
    type: 'string',
    operators: ['equals', 'in'],
    options: Object.values(ContactRole),
  },
  {
    id: 'currentStatus',
    name: 'Status',
    type: 'string',
    operators: ['equals', 'in'],
    options: Object.values(ContactStatus),
  },
  {
    id: 'createdAt',
    name: 'Created At',
    type: 'date',
    operators: ['equals', 'greaterThan', 'lessThan', 'between'],
  },
];
