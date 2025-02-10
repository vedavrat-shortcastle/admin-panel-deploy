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
import { useEffect } from 'react';

import { UseFormReturn } from 'react-hook-form';

export const LanguagesSpoken: React.FC<{
  form: UseFormReturn<any>;
  scrollableRef: React.RefObject<HTMLDivElement>;
}> = ({ form, scrollableRef }) => {
  const selectedLanguages = form.watch('languagesSpoken') || [];

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    });
  }, [selectedLanguages]);

  return (
    <div>
      <div className="col-span-12 flex items-end space-x-2 relative">
        <FormField
          control={form.control}
          name="languagesSpokenInput"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Languages Known</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Type a language and press Add"
                  onChange={(e) => field.onChange(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    (e.preventDefault(),
                    handleAddItem(
                      { form },
                      'languagesSpoken',
                      'languagesSpokenInput'
                    ))
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
            handleAddItem({ form }, 'languagesSpoken', 'languagesSpokenInput')
          }
        >
          Add
        </Button>
      </div>

      <div className="col-span-12 flex justify-start">
        <div className="bg-white p-2 rounded-md min-w-fit w-auto">
          {selectedLanguages.map((language: string, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between p-1 text-sm bg-gray-100 overflow-y-auto rounded-md mb-2 px-3"
            >
              <span className="whitespace-nowrap">{language}</span>
              <button
                onClick={() =>
                  handleRemoveItem({ form }, 'languagesSpoken', language)
                }
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
