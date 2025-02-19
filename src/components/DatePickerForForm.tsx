'use client';

import * as React from 'react';
import { format, getYear, getMonth, eachYearOfInterval } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from '@/components/ui/form';

export default function DatePicker({
  form,
  label,
  fieldName,
}: {
  label: string;
  fieldName: string;
  form: UseFormReturn<any>;
}) {
  const [date, setDate] = React.useState<Date | undefined>(
    form.getValues(fieldName) || new Date()
  );
  const [month, setMonth] = React.useState(
    date ? getMonth(date) + 1 : getMonth(new Date()) + 1
  );
  const [year, setYear] = React.useState(
    date ? getYear(date) : getYear(new Date())
  );

  // Generate months for the dropdown
  const months = Array.from({ length: 12 }, (_, i) => i + 1).map((month) => ({
    value: month.toString(),
    label: format(new Date(2023, month - 1, 1), 'MMMM'),
  }));

  // Generate years for the dropdown
  const currentYear = getYear(new Date());
  const years = eachYearOfInterval({
    start: new Date(currentYear - 100, 0, 1),
    end: new Date(currentYear + 10, 0, 1),
  }).map((date) => ({
    value: getYear(date).toString(),
    label: getYear(date).toString(),
  }));

  // Sync local state with form state
  React.useEffect(() => {
    const formValue = form.getValues(fieldName);
    if (formValue) {
      setDate(formValue);
      setMonth(getMonth(formValue) + 1);
      setYear(getYear(formValue));
    }
  }, [form, fieldName]);

  const handleMonthChange = (value: string) => {
    const newMonth = parseInt(value);
    setMonth(newMonth);
    const newDate = date
      ? new Date(year, newMonth - 1, date.getDate())
      : new Date(year, newMonth - 1, 1);
    setDate(newDate);
    form.setValue(fieldName, newDate); // Sync with form
  };

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value);
    setYear(newYear);
    const newDate = date
      ? new Date(newYear, month - 1, date.getDate())
      : new Date(newYear, month - 1, 1);
    setDate(newDate);
    form.setValue(fieldName, newDate); // Sync with form
  };

  // Ensure the calendar displays the correct month and year
  const displayedDate = React.useMemo(() => {
    return new Date(year, month - 1, 1); // First day of the selected month and year
  }, [month, year]);

  return (
    <FormField
      name={fieldName}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[280px] justify-start text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="p-4 border-b">
                  <div className="flex space-x-2">
                    <Select
                      onValueChange={handleMonthChange}
                      value={month.toString()}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={handleYearChange}
                      value={year.toString()}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((y) => (
                          <SelectItem key={y.value} value={y.value}>
                            {y.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(newDate) => {
                    if (newDate) {
                      field.onChange(newDate);
                      setDate(newDate);
                      setMonth(getMonth(newDate) + 1);
                      setYear(getYear(newDate));
                    }
                  }}
                  initialFocus
                  month={displayedDate} // Only use month prop, no year prop
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
