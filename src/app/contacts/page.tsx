'use client';

import { useState } from 'react';
import { Contact, UsersRoundIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AddContact from '@/components/contacts/AddContact';
import { columns } from '@/app/contacts/columns';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';

import { DataTable } from '@/components/data-table';
import TableSkeleton from '@/components/tableSkeleton';
import { FilterBuilder } from '@/components/dynamic-filter/DynamicFilter';
import { contactFilterFields } from '@/utils/Filter/filterEntities';
import { EntityFilter, FilterGroup } from '@/types/dynamicFilter';

export default function ContactsLandingPage() {
  const [dialogOpen, setDialogOpen] = useState(false); // Modal state
  const [filter, setFilter] = useState<EntityFilter>({
    filter: {
      logic: 'AND',
      conditions: [],
      groups: [],
    },
    pagination: {
      page: 1,
      limit: 10,
    },
    sort: {
      field: 'id',
      direction: 'desc' as const,
    },
  });

  const { data, isLoading, error } = trpc.contacts.getFiltered.useQuery(
    filter,
    {
      keepPreviousData: true,
      enabled: true,
    }
  );

  const handleFilterChange = (newFilter: FilterGroup) => {
    setFilter((prev) => ({
      ...prev,
      filter: newFilter,
      pagination: {
        ...prev.pagination,
        page: 1,
        limit: prev.pagination?.limit ?? 20,
      }, // Reset to first page on filter change
    }));
  };

  return (
    <div className="container py-5 px-10">
      {/* Header */}
      <div className="flex items-center">
        <UsersRoundIcon className="text-primary" size={35} strokeWidth={2} />
        <h1 className="text-3xl font-semibold px-2 py-1">Contacts</h1>
      </div>

      {/* Search & Add Contact */}
      <div className="my-2 space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <FilterBuilder
            fields={contactFilterFields}
            onChange={handleFilterChange}
            initialFilters={filter.filter}
          />
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Contact</Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold ">
                <div className="flex items-center">
                  <Contact className="text-primary" size={36} />
                  <div className="ml-2 mt-1">Add Contact</div>
                </div>
              </DialogTitle>
            </DialogHeader>

            {/* Multi-Step Contact Form */}
            <div
              className="overflow-y-auto flex-grow"
              style={{ maxHeight: 'calc(100vh - 150px)' }}
            >
              <AddContact />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Table or Loading State */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <TableSkeleton />
        </div>
      ) : error ? ( // Handle error case
        <div className="flex justify-center py-10 text-red-500">
          <p className="ml-2">Error fetching contacts: {error.message}</p>
        </div>
      ) : !data || data.data.length === 0 ? ( // Handle empty data case
        <div className="flex justify-center py-10">
          <p className="ml-2">No contacts found.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data.data}
          pagination={{
            pageCount: data.pageCount,
            page: filter.pagination?.page ?? 1,
            onPageChange: (page) =>
              setFilter((prev) => ({
                ...prev,
                pagination: {
                  ...prev.pagination,
                  page,
                  limit: prev.pagination?.limit ?? 20,
                },
              })),
          }}
        />
      )}
    </div>
  );
}
