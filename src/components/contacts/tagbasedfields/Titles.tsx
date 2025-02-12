import {
  handleAddItem,
  handleRemoveItem,
} from '@/components/contacts/tagbasedfields/tagutils';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { X } from 'lucide-react';

import { UseFormReturn } from 'react-hook-form';

export const Titles = ({ form }: { form: UseFormReturn<any> }) => {
  const selectedTitles = form.watch('titles') || [];

  const titles = ['FIDETrainer', 'FIDEInstructor', 'GM', 'IM', 'WIM', 'WGM'];

  return (
    <div>
      <div className="col-span-12 flex items-end space-x-2 relative">
        <FormField
          control={form.control}
          name="titlesInput"
          render={() => (
            <FormItem className="flex-grow">
              <FormLabel>Titles</FormLabel>
              <Select
                value=""
                onValueChange={(value) => {
                  if (value && !selectedTitles.includes(value)) {
                    form.setValue('titles', [...selectedTitles, value]);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select multiple Titles" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {titles.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant="default"
          onClick={() => handleAddItem({ form }, 'titles', 'titlesInput')}
        >
          Add
        </Button>
      </div>

      <div className="col-span-12 flex justify-start">
        <div className="bg-white p-2 rounded-md min-w-fit w-auto">
          {selectedTitles.map((title: string, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between p-1 text-sm bg-gray-100 rounded-md mb-2 px-3"
            >
              <span className="whitespace-nowrap">{title}</span>
              <button
                onClick={() => handleRemoveItem({ form }, 'titles', title)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <X className="ml-3" size={14} strokeWidth={4} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
