'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Contact = {
  firstname: string;
  lastname: string;
  email: string;
  role: 'Coach' | 'Subcoach' | 'Admin';
  title: 'GM' | 'IM' | 'FM' | 'CM' | 'NM';
  status: 'active' | 'lead' | 'churned' | 'prospect' | 'new';
};

import { PencilIcon, TrashIcon } from 'lucide-react';

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: 'firstname',
    header: 'First Name',
  },
  {
    accessorKey: 'lastname',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status');
      let variant: 'green' | 'orange' | 'red' | 'gray' | 'blue' | 'outline';
      switch (status) {
        case 'active':
          variant = 'green';
          break;
        case 'lead':
          variant = 'orange';
          break;
        case 'churned':
          variant = 'red';
          break;
        case 'prospect':
          variant = 'gray';
          break;
        case 'new':
          variant = 'blue';
          break;
        default:
          variant = 'outline';
      }
      return <Badge variant={variant}>{row.getValue('status')}</Badge>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <PencilIcon size={15} onClick={() => handleEdit(row.original)} />
        <TrashIcon
          color="red"
          size={15}
          className=""
          onClick={() => handleDelete(row.original)}
        />
      </div>
    ),
  },
];

const handleEdit = (contact: Contact) => {
  // Implement edit functionality here
  console.log('Edit contact', contact);
};

const handleDelete = (contact: Contact) => {
  // Implement delete functionality here
  console.log('Delete contact', contact);
};
