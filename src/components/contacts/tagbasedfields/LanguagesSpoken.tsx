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
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

export const LanguagesSpoken: React.FC<{
  form: UseFormReturn<any>;
  scrollableRef: React.RefObject<HTMLDivElement>;
}> = ({ form, scrollableRef }) => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const languageInput = form.watch('languagesSpokenInput') || '';

  useEffect(() => {
    requestAnimationFrame(() => {
      if (scrollableRef.current) {
        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
      }
    });
  }, [selectedLanguages]);

  const handleAddLanguage = () => {
    if (!languageInput.trim() || selectedLanguages.includes(languageInput))
      return;

    setSelectedLanguages([...selectedLanguages, languageInput.trim()]);
    form.setValue('languagesSpoken', [
      ...selectedLanguages,
      languageInput.trim(),
    ]);
    form.setValue('languagesSpokenInput', '');
  };

  const handleRemoveLanguage = (language: string) => {
    const updatedLanguages = selectedLanguages.filter((l) => l !== language);
    setSelectedLanguages(updatedLanguages);
    form.setValue('languagesSpoken', updatedLanguages);
  };

  return (
    <div>
      <FormField
        control={form.control}
        name="languagesSpokenInput"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Languages Known</FormLabel>
            <div className="flex items-center space-x-2">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Type a language..."
                  onChange={(e) => field.onChange(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    (e.preventDefault(), handleAddLanguage())
                  }
                  className="flex-grow"
                />
              </FormControl>
              <Button type="button" onClick={handleAddLanguage}>
                Add
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex flex-wrap gap-2 mt-3">
        {selectedLanguages.length > 0 ? (
          selectedLanguages.map((language, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-200 px-3 py-1 rounded-lg"
            >
              <span>{language}</span>
              <button
                onClick={() => handleRemoveLanguage(language)}
                className="ml-2"
              >
                <X
                  size={14}
                  className="text-gray-600 hover:text-red-500"
                  strokeWidth={3}
                />
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm italic">
            No languages added yet.
          </div>
        )}
      </div>
    </div>
  );
};
