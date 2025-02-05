'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { trpc } from '@/hooks/trpc-provider';

export function UserTable() {
  const { data, isLoading } = trpc.users.getAll.useQuery();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableCaption>A list of users in the system.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((user) => (
          <TableRow key={user.uuid}>
            <TableCell>{`${user.firstname} ${user.lastname}`}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
