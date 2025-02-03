import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { UserTable } from '@/components/dashboard/UserTable';

export default function DashboardPage() {
  return (
    <DashboardShell>
      <UserTable />
    </DashboardShell>
  );
}
