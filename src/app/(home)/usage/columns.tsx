'use client';

import { ColumnDef } from '@tanstack/react-table';
import { usageFormValues } from '@/schemas/usage';

export const columns: ColumnDef<usageFormValues>[] = [
  {
    accessorKey: 'academy',
    header: ' Academy Name',
  },
  {
    accessorKey: 'coach',
    header: 'Coach Name',
  },
  {
    accessorKey: 'assignmentColor',
    header: 'assignmentColor',
  },
  {
    accessorKey: 'classroomColor',
    header: 'classroomColor',
  },
  {
    accessorKey: 'overallUsageColor',
    header: 'overallUsageColor',
  },
  {
    accessorKey: 'coursesColor',
    header: 'coursesColor',
  },
  {
    accessorKey: 'quizColor',
    header: 'quizColor',
  },
  {
    accessorKey: 'tournamentColor',
    header: 'tournamentColor',
  },
];
