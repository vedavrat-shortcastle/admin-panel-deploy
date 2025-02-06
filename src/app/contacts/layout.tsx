import { AdminSidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className=" h-full flex ">
      <SidebarProvider>
        <AdminSidebar />
        {children}
      </SidebarProvider>
    </section>
  );
}
