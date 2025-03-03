import { Skeleton } from '@/components/ui/skeleton';

export default function CustomerProfileLoading() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-10 w-[100px]" />
    </div>
  );
}
