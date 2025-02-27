'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

import { PencilIcon, TrashIcon } from 'lucide-react';
import { CustomerTable } from '@/types/customerSection';

export const columns: ColumnDef<CustomerTable>[] = [
  {
    accessorKey: 'contact.firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'contact.lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'academy.name',
    header: 'Academy Name',
  },
  {
    accessorKey: 'contact.email',
    header: 'Email',
  },
  {
    accessorKey: 'salesType',
    header: 'Sales Type',
    cell: ({ row }) => {
      const salesType = row.getValue('salesType');
      let variant: 'green' | 'orange' | 'gray' | 'blue' | 'outline';
      switch (salesType) {
        case 'NEW':
          variant = 'green';
          break;
        case 'UPSELL':
          variant = 'orange';
          break;
        case 'ONETIME':
          variant = 'gray';
          break;
        case 'RENEWAL':
          variant = 'blue';
          break;
        case 'LIFETIME':
          variant = 'gray';
          break;
        default:
          variant = 'green';
      }
      return <Badge variant={variant}>{row.getValue('salesType')}</Badge>;
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

const handleEdit = (customer: CustomerTable) => {
  // Implement edit functionality here
  console.log('Edit contact', customer);
};

const handleDelete = (customer: CustomerTable) => {
  // Implement delete functionality here
  console.log('Delete contact', customer);
};
