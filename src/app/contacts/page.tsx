import { contacts } from '@/app/contacts/dummyData';
import { Contact, columns } from './columns';
import { DataTable } from './data-table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function getData(): Promise<Contact[]> {
  // Fetch data from your API here.
  return contacts;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container py-10">
      <div className="my-4 flex justify-between">
        <div>Search filters</div>
        <Link href="contacts/create">
          <Button variant="outline">Add Contact</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
