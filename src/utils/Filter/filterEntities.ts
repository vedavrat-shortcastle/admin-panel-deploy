import { FilterField } from '@/types/dynamicFilter';

export const contactFilterFields: FilterField[] = [
  {
    id: 'firstname',
    name: 'First Name',
    type: 'string',
    operators: ['equals', 'contains', 'startsWith'],
  },
  {
    id: 'lastname',
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
    options: ['ADMIN', 'USER', 'GUEST'], // Add your actual role options
  },
];
