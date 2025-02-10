import { academies } from '@/app/contacts/dummyAcademyData';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';

export const AcademyNames: React.FC<{ form: UseFormReturn<any> }> = ({
  form,
}) => {
  const [filteredAcademies, setFilteredAcademies] = useState<string[]>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const selectedAcademies = form.watch('academyNames') || [];

  const handleAcademySearch = (value: string) => {
    const searchValue = value.trim().toLowerCase();
    if (searchValue === '') {
      setFilteredAcademies([]);
      setShowDropdown(false);
      return;
    }

    const filtered = academies
      .filter(
        (academy) =>
          academy.name.toLowerCase().includes(searchValue) &&
          !selectedAcademies.includes(academy.name) // Exclude selected ones
      )
      .map((academy) => academy.name);

    setFilteredAcademies(filtered);
    setShowDropdown(filtered.length > 0);
  };

  // Handle selecting an academy from the dropdown
  const handleSelectAcademy = (academy: string) => {
    form.setValue('academyNames', [...selectedAcademies, academy]);
    form.setValue('academyNamesInput', '');
    setShowDropdown(false);
  };

  const handleRemoveAcademy = (academyName: string) => {
    const updatedAcademies = selectedAcademies.filter(
      (name: string) => name !== academyName
    );
    form.setValue('academyNames', updatedAcademies);
  };

  return (
    <div>
      <div className="col-span-12 flex items-end space-x-2 relative">
        <Controller
          name="academyNamesInput"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-grow relative">
              <FormLabel>Academy Names (Multiple)</FormLabel>
              <FormControl>
                <Input
                  value={field.value ?? ''}
                  placeholder="Search Academy and Select"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleAcademySearch(e.target.value);
                  }}
                  onBlur={() => {
                    const timeoutId = setTimeout(() => {
                      if (isMounted.current) {
                        setShowDropdown(false);
                      }
                    }, 200);
                    return () => clearTimeout(timeoutId);
                  }}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              {showDropdown && (
                <div className="absolute left-0 right-0 bg-white border border-gray-300 shadow-lg mt-1 rounded-md max-h-40 overflow-y-auto z-10">
                  {filteredAcademies.map((academy, index) => (
                    <div
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onMouseDown={() => handleSelectAcademy(academy)}
                    >
                      {academy}
                    </div>
                  ))}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Display Selected Academies */}
      <div className="col-span-12 flex justify-start">
        <div className="bg-white p-2 rounded-md min-w-fit w-auto">
          {selectedAcademies.map((academy: string, index: any) => (
            <div
              key={index}
              className="flex items-center justify-between p-1 text-sm bg-gray-100 rounded-md mb-2 px-3"
            >
              <span className="whitespace-nowrap">{academy}</span>
              <button
                onClick={() => handleRemoveAcademy(academy)}
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
