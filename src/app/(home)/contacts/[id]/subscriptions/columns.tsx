'use client';

import { ColumnDef } from '@tanstack/react-table';

import { PencilIcon, TrashIcon } from 'lucide-react';
import { SubscriptionView } from '@/types/customerSection';

export const columns: ColumnDef<SubscriptionView>[] = [
  {
    accessorKey: 'academy.name',
    header: 'Academy Name',
  },
  {
    accessorKey: 'salesType',
    header: 'Sales Type',
  },
  {
    accessorKey: 'planEndDate',
    header: 'Plan End Date',
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

const handleEdit = (subscription: SubscriptionView) => {
  // Implement edit functionality here
  console.log('Edit contact', subscription);
};

const handleDelete = (subscription: SubscriptionView) => {
  // Implement delete functionality here
  console.log('Delete contact', subscription);
};
