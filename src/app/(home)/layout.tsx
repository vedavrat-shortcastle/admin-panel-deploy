import AuthRedirect from '@/components/auth/AuthRedirect';
import { AdminSidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthRedirect>
      <div>
        <SidebarProvider>
          <AdminSidebar />
          <main className="h-full w-full">{children}</main>
        </SidebarProvider>
      </div>
      <Toaster />
    </AuthRedirect>
  );
}
