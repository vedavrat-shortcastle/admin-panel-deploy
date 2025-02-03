import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Teacher' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Admin' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Student' },
  {
    id: 5,
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    role: 'Teacher',
  },
];

export function UserTable() {
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
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
