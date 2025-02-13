'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

import { PencilIcon, TrashIcon } from 'lucide-react';
import { ContactsTable } from '@/types/contactSection';

export const columns: ColumnDef<ContactsTable>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
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
    accessorKey: 'titles',
    header: 'Titles',
  },
  {
    accessorKey: 'currentStatus',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('currentStatus');
      let variant: 'green' | 'orange' | 'red' | 'gray' | 'blue' | 'outline';
      switch (status) {
        case 'new':
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
        case 'customer':
          variant = 'blue';
          break;
        case 'high_prospect':
          variant = 'gray';
          break;
        default:
          variant = 'green';
      }
      return <Badge variant={variant}>{row.getValue('currentStatus')}</Badge>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <PencilIcon size={16} onClick={() => handleEdit(row.original)} />
        <TrashIcon
          color="red"
          size={16}
          className=""
          onClick={() => handleDelete(row.original)}
        />
      </div>
    ),
  },
];

const handleEdit = (contact: ContactsTable) => {
  // Implement edit functionality here
  console.log('Edit contact', contact);
};

const handleDelete = (contact: ContactsTable) => {
  // Implement delete functionality here
  console.log('Delete contact', contact);
};
