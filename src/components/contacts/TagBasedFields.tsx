'use client';
import { academies } from '@/app/contacts/dummyAcademyData';
import { Button } from '@/components/ui/button';
// this is a file withall the tag based fields in the professionalInfo component

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';

// Handle adding a tag or location or language
const handleAddItem = (
  { form }: { form: UseFormReturn<any> },
  fieldName: string,
  inputFieldName: string
) => {
  const value = form.watch(inputFieldName)?.trim();
  if (value && !form.watch(fieldName).includes(value)) {
    form.setValue(fieldName, [...form.watch(fieldName), value]);
    form.setValue(inputFieldName, '');
  }
};

// Handle removing a tag or location or language
const handleRemoveItem = (
  { form }: { form: UseFormReturn<any> },
  fieldName: string,
  item: string
) => {
  const updatedItems = form.watch(fieldName).filter((i: string) => i !== item);
  form.setValue(fieldName, updatedItems);
};

export const AcademyNames = ({ form }: { form: UseFormReturn<any> }) => {
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

export const CustomTags = ({ form }: { form: UseFormReturn<any> }) => {
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
          variant="accent"
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

export const PhysicallyTaught = ({ form }: { form: UseFormReturn<any> }) => {
  const selectedLocations = form.watch('physicallyTaught') || [];
  return (
    <div>
      <div className="col-span-12 flex items-end space-x-2 relative">
        <FormField
          control={form.control}
          name="physicallyTaughtInput"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Physical Locations Taught</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Type a location and press Add"
                  onChange={(e) => field.onChange(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    (e.preventDefault(),
                    handleAddItem(
                      { form },
                      'physicallyTaught',
                      'physicallyTaughtInput'
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
          variant="accent"
          onClick={() =>
            handleAddItem({ form }, 'physicallyTaught', 'physicallyTaughtInput')
          }
        >
          Add
        </Button>
      </div>

      {/* Display Selected Locations */}
      <div className="col-span-12 flex justify-start">
        <div className="bg-white p-2 rounded-md min-w-fit w-auto">
          {selectedLocations.map((location: string, index: any) => (
            <div
              key={index}
              className="flex items-center justify-between p-1 text-sm bg-gray-100 rounded-md mb-2 px-3"
            >
              <span className="whitespace-nowrap">{location}</span>
              <button
                onClick={() =>
                  handleRemoveItem({ form }, 'physicallyTaught', location)
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

export const LanguagesSpoken = ({
  form,
  scrollableRef,
}: {
  form: UseFormReturn<any>;
  scrollableRef: React.RefObject<HTMLDivElement>;
}) => {
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
          variant="accent"
          onClick={() =>
            handleAddItem({ form }, 'languagesSpoken', 'languagesSpokenInput')
          }
        >
          Add
        </Button>
      </div>

      <div className="col-span-12 flex justify-start">
        <div className="bg-white p-2 rounded-md min-w-fit w-auto">
          {selectedLanguages.map((language: string, index: any) => (
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

export const Titles = ({ form }: { form: UseFormReturn<any> }) => {
  const selectedTitles = form.watch('titles') || [];

  const titles = ['FIDE Trainer', 'FIDE Instructor', 'GM', 'IM', 'WIM', 'WGM'];

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
          variant="accent"
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
