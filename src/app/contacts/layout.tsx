import { AdminSidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="py-5 mx-10">
      <SidebarProvider>
        <AdminSidebar />
        {children}
      </SidebarProvider>
    </section>
  );
}
