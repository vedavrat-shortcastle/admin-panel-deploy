'use client';

import { useEffect, useState } from 'react';
import { Contact, UsersRoundIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { columns } from './columns';
import { DataTable } from './data-table';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AddContact from '@/components/contacts/AddContact';

async function getData() {
  const response = await fetch(
    'https://67a307f6409de5ed52571dfd.mockapi.io/api/chessplayer',
    { method: 'GET' }
  );
  return await response.json();
}

export default function ContactsLandingPage() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false); // Modal state

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      setData(result);
    };
    fetchData();
  }, []);

  // Handle form submission and close modal

  return (
    <div className="container py-5 px-10">
      {/* Header */}
      <div className="flex items-center">
        <UsersRoundIcon className="text-primary" size={35} strokeWidth={2} />
        <h1 className="text-3xl font-semibold px-2 py-1">Contacts</h1>
      </div>

      {/* Search & Add Contact */}
      <div className="my-2 flex justify-between">
        <div>Search filters</div>

        {/* Modal Pop-up for Adding Contact */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="font-semibold">
              Add Contact
            </Button>
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

      {/* Data Table */}
      <DataTable columns={columns} data={data} />
    </div>
  );
}
