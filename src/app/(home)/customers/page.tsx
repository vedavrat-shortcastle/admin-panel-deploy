'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { DataTable } from '@/components/data-table';

import { trpc } from '@/utils/trpc';
import TableSkeleton from '@/components/tableSkeleton';
import AddCustomer from '@/components/customer/AddCustomer';
import { columns } from '@/app/(home)/customers/columns';

export default function CustomersLandingPage() {
  const [open, setOpen] = useState(false); // Modal state

  const { data, isLoading, error } = trpc.subscription.getAll.useQuery();

  return (
    <div className="container py-5 px-10">
      {/* Header */}
      <div className="flex items-center">
        <Users className="text-primary" size={36} strokeWidth={2} />
        <h1 className="text-3xl font-semibold px-2 py-1">Customers</h1>
      </div>

      {/* Search & Add Contact */}
      <div className="my-2 flex justify-between">
        <div>Search filters</div>

        {/* Modal Pop-up for Adding Contact */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="font-semibold">
              Add Customer
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold ">
                <div className="flex items-center">
                  <Users className="text-primary" size={36} />
                  <div className="ml-2 mt-1">Add Customer</div>
                </div>
              </DialogTitle>
            </DialogHeader>

            {/* Multi-Step Contact Form */}
            <div
              className="overflow-y-auto flex-grow"
              style={{ maxHeight: 'calc(100vh - 150px)' }}
            >
              <AddCustomer />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <TableSkeleton />
        </div>
      ) : error ? ( // Handle error case
        <div className="flex justify-center py-10 text-red-500">
          <p className="ml-2">Error fetching contacts: {error.message}</p>
        </div>
      ) : !data || data.length === 0 ? ( // Handle empty data case
        <div className="flex justify-center py-10">
          <p className="ml-2">No contacts found.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}
