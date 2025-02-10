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
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

import { UseFormReturn } from 'react-hook-form';

export const CustomTags: React.FC<{ form: UseFormReturn<any> }> = ({
  form,
}) => {
  const selectedTags = form.watch('customTags') || [];

  return (
    <div className="space-y-2">
      <div className="col-span-12 flex items-end space-x-2 relative">
        <FormField
          control={form.control}
          name="customTagsInput"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Custom Tags</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Type a tag and press Add"
                  onChange={(e) => field.onChange(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    (e.preventDefault(),
                    handleAddItem({ form }, 'customTags', 'customTagsInput'))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant="default"
          onClick={() =>
            handleAddItem({ form }, 'customTags', 'customTagsInput')
          }
        >
          Add
        </Button>
      </div>
      {selectedTags.length > 0 && (
        <div className="col-span-12 flex justify-start">
          <div className="bg-white p-2 rounded-md min-w-fit w-auto">
            {selectedTags.map((tag: string, index: any) => (
              <div
                key={index}
                className="flex items-center justify-between p-1 text-sm bg-gray-100 rounded-md mb-2 px-3"
              >
                <span className="whitespace-nowrap">{tag}</span>
                <button
                  onClick={() => handleRemoveItem({ form }, 'customTags', tag)}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  <X className="ml-3" size={14} strokeWidth={4} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
