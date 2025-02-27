'use client';
import { Suspense } from 'react';
import { trpc } from '@/hooks/trpc-provider';
import { useParams } from 'next/navigation';
import { CustomerProfile } from '@/app/customer/[id]/cutomerProfile/customerProfile';
import CustomerProfileLoading from '@/app/customer/[id]/customerProfileLoading';

export default function SubscriptionPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const {
    data: subscription,
    isLoading,
    error,
  } = trpc.subscription.getById.useQuery(id!, {
    enabled: !!id, // Ensures the query only runs when `id` exists
  });

  if (!id) return <p>Invalid subscription ID.</p>;
  if (isLoading) return <CustomerProfileLoading />;
  if (error) return <p>Error fetching subscription: {error.message}</p>;
  if (!subscription) return <p>No subscription found</p>;

  return (
    <Suspense fallback={<CustomerProfileLoading />}>
      <CustomerProfile subscription={subscription} />
    </Suspense>
  );
}
