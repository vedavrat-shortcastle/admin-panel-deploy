'use client';
import { Suspense } from 'react';
import ContactProfile from '@/app/(home)/contacts/[id]/contactProfile/contactProfile';
import ContactProfileLoading from '@/app/(home)/contacts/[id]/contactProfileLoading';
import { trpc } from '@/hooks/trpc-provider';
import { useParams } from 'next/navigation';

export default function ContactPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const {
    data: contact,
    isLoading,
    error,
  } = trpc.contacts.getById.useQuery(id!, {
    enabled: !!id,
  });
  console.log('Subscription Data:', contact);
  if (!id) return <p>Invalid contact ID.</p>;
  if (isLoading) return <ContactProfileLoading />;
  if (error) return <p>Error fetching contact: {error.message}</p>;
  if (!contact) return <p>No contact found</p>;

  return (
    <Suspense fallback={<ContactProfileLoading />}>
      <ContactProfile contact={contact} />
    </Suspense>
  );
}
