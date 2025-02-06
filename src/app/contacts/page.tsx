'use client';

import { columns } from './columns';
import { DataTable } from './data-table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { UsersRoundIcon } from 'lucide-react';

async function getData() {
  const response = await fetch(
    'https://67a307f6409de5ed52571dfd.mockapi.io/api/chessplayer',
    { method: 'GET' }
  );
  const data = await response.json();
  console.log('this is data', data);
  return data;
}

export default function DemoPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      setData(result);
    };
    fetchData();
  }, []);

  return (
    <div className="container py-5 px-10">
      <div className="flex items-center">
        <UsersRoundIcon color="#645EEB" size={35} strokeWidth={2} />
        <h1 className="text-3xl font-semibold px-2 py-1">Contacts</h1>
      </div>
      <div className="my-2 flex justify-between">
        <div>Search filters</div>
        <Link href="contacts/create">
          <Button variant="accent" className="font-semibold">
            Add Contact
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
