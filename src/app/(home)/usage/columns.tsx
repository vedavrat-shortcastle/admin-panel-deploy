'use client';

import { ColumnDef } from '@tanstack/react-table';
import { usageFormValues } from '@/schemas/usage';

export const columns: ColumnDef<usageFormValues>[] = [
  {
    accessorKey: 'usage.academy',
    header: ' academy',
  },
  {
    accessorKey: 'usage.coach',
    header: 'coach',
  },
  {
    accessorKey: 'usage.overallUsageColor',
    header: 'overallUsageColor',
  },
];
