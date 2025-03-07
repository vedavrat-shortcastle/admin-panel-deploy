'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import { Contact, UsersRoundIcon, Filter, ArrowDownAZ } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AddContact from '@/components/contacts/AddContact';
import { columns } from '@/app/(home)/contacts/columns';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';

import { DataTable } from '@/components/data-table';
import TableSkeleton from '@/components/tableSkeleton';
import { FilterBuilder } from '@/components/dynamic-filter/DynamicFilter';
import { contactFilterFields } from '@/utils/Filter/filterEntities';
import { EntityFilter, FilterGroup } from '@/types/dynamicFilter';
import { addSearchConditions } from '@/utils/Filter/searchUtils';
import { ContactsTable } from '@/types/contactSection';
import DynamicSort from '@/components/DynamicSort';

export default function ContactsLandingPage() {
  const [showSortContainer, setShowSortContainer] = useState(false);
  const sortRef = useRef<HTMLDivElement | null>(null);
  const sortButtonRef = useRef<HTMLDivElement | null>(null);
  const [showFilterContainer, setShowFilterContainer] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const filterButtonRef = useRef<HTMLDivElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilter((prev) => ({
        ...prev,
        filter: addSearchConditions(
          prev.filter,
          ['firstName', 'lastName', 'email'],
          value
        ),
      }));
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

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

  const router = useRouter();

  const handleRowClick = (rowData: ContactsTable) => {
    router.push(`/contacts/${rowData.id}`);
  };

  const toggleSortContainer = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevents event bubbling
    setShowSortContainer((prev) => !prev);
  };

  const toggleFilterContainer = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevents event bubbling
    setShowFilterContainer((prev) => !prev);
  };
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      filterRef.current &&
      !filterRef.current.contains(event.target as Node) &&
      filterButtonRef.current &&
      !filterButtonRef.current.contains(event.target as Node) &&
      sortRef.current &&
      !sortRef.current.contains(event.target as Node) &&
      sortButtonRef.current &&
      !sortButtonRef.current.contains(event.target as Node)
    ) {
      setShowFilterContainer(false);
      setShowSortContainer(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="container py-5 px-10 relative">
      {/* Header */}
      <div className="flex items-center gap-1">
        <UsersRoundIcon className="text-primary" size={35} strokeWidth={2} />
        <h1 className="text-3xl font-semibold px-2 py-1">Contacts</h1>
        <div ref={filterButtonRef}>
          <Filter
            size={20}
            className="ml-1 mr-2 cursor-pointer"
            onClick={toggleFilterContainer}
          />
        </div>
        <div ref={sortButtonRef}>
          <ArrowDownAZ
            size={22}
            className="cursor-pointer"
            onClick={toggleSortContainer}
          />
        </div>
      </div>

      {showFilterContainer && (
        <div
          ref={filterRef}
          className="bg-white flex flex-col gap-2 shadow border border-gray-200 p-4 rounded-lg absolute top-16 left-4 right-4 h-auto z-50"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by First Name, Last Name, or Email"
            className="w-full p-2 border rounded"
          />
          <FilterBuilder
            fields={contactFilterFields}
            onChange={handleFilterChange}
            initialFilters={filter.filter}
            sectionName="CONTACTS"
          />
        </div>
      )}
      {showSortContainer && (
        <div
          ref={sortRef}
          className="bg-white flex flex-col gap-2 shadow border border-gray-200 p-4 rounded-lg absolute top-16 left-64 h-auto z-50"
        >
          <DynamicSort
            onSortChange={(field, direction) =>
              setFilter((prev) => ({
                ...prev,
                sort: { field, direction },
              }))
            }
          />
        </div>
      )}

      <div className="my-2 space-y-4">
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
            pageSize: filter.pagination?.limit ?? 10,
            onPageChange: (page, pageSize) =>
              setFilter((prev) => ({
                ...prev,
                pagination: {
                  ...prev.pagination,
                  page,
                  limit: pageSize,
                },
              })),
          }}
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
}
