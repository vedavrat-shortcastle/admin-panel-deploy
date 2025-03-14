'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { GaugeCircle, CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import TableSkeleton from '@/components/tableSkeleton';
import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import UsageForm from '@/components/usages/addUsages';
import { Dialog } from '@radix-ui/react-dialog';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const colors = ['0%', '20%', '40%', '60%', '80%', '100%'];

const dummyUsageDataArray = Array.from({ length: 15 }, (_, index) => ({
  academy: `Academy ${index + 1}`,
  coach: `Coach ${index + 1}`,
  overallUsageColor: colors[Math.floor(Math.random() * colors.length)],
  classroomColor: colors[Math.floor(Math.random() * colors.length)],
  tournamentColor: colors[Math.floor(Math.random() * colors.length)],
  coursesColor: colors[Math.floor(Math.random() * colors.length)],
  gameAreaColor: colors[Math.floor(Math.random() * colors.length)],
  quizColor: colors[Math.floor(Math.random() * colors.length)],
  assignmentColor: colors[Math.floor(Math.random() * colors.length)],
  databaseColor: colors[Math.floor(Math.random() * colors.length)],
}));

export default function UsageTable() {
  const data = dummyUsageDataArray;
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false); // Modal state

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg relative min-h-screen">
      {/* HEADER */}
      <div className="flex items-center ml-7 mt-5 ">
        <GaugeCircle className="text-primary" size={35} strokeWidth={2} />
        <h1 className="text-3xl font-bold flex p-2 items-center">Usage</h1>
      </div>

      {/* SEARCH , Select , Date , addusage button  */}
      <div className="flex flex-col gap-4 p-2">
        <div className="flex items-center gap-2 ">
          <Input
            type="search"
            placeholder="Search"
            className="w-[300px] mt-6"
          />
          <div className="flex flex-col">
            <label
              htmlFor="subscription"
              className="pl-3 block text-sm font-medium leading-6 text-gray-900"
            >
              Subscription Type
            </label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  className="placeholder:font-custom placeholder:text-gray-400"
                  placeholder="select"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem disabled value="select">
                  Select
                </SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                {/* Add more subscription types as needed */}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="subscription"
              className="pl-3 block text-sm font-medium leading-6 text-gray-900"
            >
              Renewal due date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className="w-[200px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                {/* DatePicker is working only if we produce form as props  */}
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex  mt-6 items-end w-full h-15 justify-end">
            {/* Modal Pop-up for Adding usage */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Add Usage</Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold ">
                    <div className="flex items-center">
                      <GaugeCircle className="text-primary" size={36} />
                      <div className="ml-2 mt-1">Add Usage</div>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <div
                  className="overflow-y-auto flex-grow"
                  style={{ maxHeight: 'calc(100vh - 220px)' }}
                >
                  <UsageForm />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* data display */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <TableSkeleton />
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}
