import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { FilterField } from '@/types/dynamicFilter';

interface FilterValueInputProps {
  field: FilterField;
  operator: string;
  value: any;
  onChange: (value: any) => void;
}

export const filterValueSchema = z.object({
  string: z.string().optional(),
  number: z.number().min(-999999).max(999999).optional(),
  date: z.date().optional(),
  numberRange: z
    .object({
      min: z.number().min(-999999),
      max: z.number().max(999999),
    })
    .optional(),
  dateRange: z
    .object({
      start: z.date(),
      end: z.date(),
    })
    .optional(),
});

export const FilterValueInput: React.FC<FilterValueInputProps> = ({
  field,
  operator,
  value,
  onChange,
}) => {
  const form = useForm({
    resolver: zodResolver(filterValueSchema),
    defaultValues: value,
  });
  switch (field.type) {
    case 'date':
      return operator === 'between' ? (
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[240px] justify-start text-left font-normal',
                  !value?.start && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value?.start ? format(value.start, 'PPP') : 'Start date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value?.start}
                onSelect={(date) => onChange({ ...value, start: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[240px] justify-start text-left font-normal',
                  !value?.end && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value?.end ? format(value.end, 'PPP') : 'End date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value?.end}
                onSelect={(date) => onChange({ ...value, end: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[240px] justify-start text-left font-normal',
                !value && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value && !isNaN(new Date(value).getTime())
                ? format(new Date(value), 'PPP')
                : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={onChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    case 'string':
      if (field.options) {
        return (
          <Select value={value} onValueChange={onChange} defaultValue={value}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select options" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      } else {
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="string"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      value={value}
                      className="w-[240px]"
                      placeholder="Enter value"
                      type="text"
                      onChange={(e) => {
                        field.onChange(e);
                        onChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        );
      }

    case 'number':
      return operator === 'between' ? (
        <Form {...form}>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="numberRange.min"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      className="w-[120px]"
                      placeholder="Min"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                        onChange({ ...value, min: Number(e.target.value) });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberRange.max"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      className="w-[120px]"
                      placeholder="Max"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                        onChange({ ...value, max: Number(e.target.value) });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      ) : (
        <Form {...form}>
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    className="w-[240px]"
                    placeholder="Enter number"
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                      onChange(Number(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      );
    default:
      return null;
  }
};
