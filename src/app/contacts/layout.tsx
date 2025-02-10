import { Toaster } from '@/components/ui/toaster';

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className=" h-full flex justify-center w-full">
      {children}
      <Toaster />
    </section>
  );
}
