'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

import { PencilIcon, TrashIcon } from 'lucide-react';
import { ContactsTable } from '@/types/contactSection';
import { ChessTitle } from '@prisma/client';
import { redirect } from 'next/navigation';

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
    cell: ({ row }) => {
      const titles: ChessTitle[] = row.getValue('titles');
      return (
        <div>
          {titles.map((title, index) => (
            <Badge key={index} variant="outline">
              {title}
            </Badge>
          ))}
        </div>
      );
    },
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
  redirect(`/contacts/${contact.id}`);
};

const handleDelete = (contact: ContactsTable) => {
  console.log('Delete contact', contact);
};
