// import { DashboardShell } from '@/components/dashboard/DashboardShell';
// import { UserTable } from '@/components/dashboard/UserTable';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  redirect('/contacts');
  return (
    <div></div>
    // <DashboardShell>
    //   <UserTable />
    // </DashboardShell>
  );
}
