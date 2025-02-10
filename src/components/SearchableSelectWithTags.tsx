import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Controller, UseFormReturn } from 'react-hook-form';
import { debounce } from 'lodash';
import { X } from 'lucide-react';

export type SelectionMode = 'single' | 'multiple';

interface SearchableSelectWithTagsProps {
  form: UseFormReturn<any>; // Or be more specific with your form type
  fieldName: string; // Field name in the form (e.g., 'academyNames', 'languagesSpoken')
  Values: string[]; //
  label?: string;
  placeholder?: string;
  selectionMode?: SelectionMode; // New prop for single/multiple selection
  onSearch?: (searchTerm: string) => void; // Callback for search input change**
}

export const SearchableSelectWithTags = ({
  form,
  fieldName,
  Values, // Now directly expects string array
  label,
  placeholder,
  selectionMode = 'multiple',
  onSearch,
}: SearchableSelectWithTagsProps) => {
  const [searchedItems, setSearchedItems] = useState<string[]>([]);
  const isMounted = useRef(true);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const selectedItems =
    form.watch(fieldName) || (selectionMode === 'multiple' ? [] : '');

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (Values) {
      // Now directly using fetchedValues as string array
      setSearchedItems(Values); // Directly set searchedItems to fetchedValues
      setShowDropdown(Values.length > 0);
    } else {
      setSearchedItems([]);
      setShowDropdown(false);
    }
  }, [Values]); // Dependency on fetchedValues (string array)

  const handleItemSearch = useCallback(
    debounce((value: string) => {
      const searchValue = value.trim().toLowerCase();
      if (searchValue === '') {
        setSearchedItems([]);
        setShowDropdown(false);
        if (onSearch) {
          onSearch('');
        }
        return;
      }

      if (onSearch) {
        onSearch(searchValue);
      }
    }, 500),
    [onSearch]
  );

  const handleSelectItem = (item: string) => {
    if (selectionMode === 'multiple') {
      form.setValue(fieldName, [...(selectedItems as string[]), item]);
    } else {
      form.setValue(fieldName, item);
      setShowDropdown(false);
    }
    form.setValue(`${fieldName}Input`, '');
    if (selectionMode === 'multiple') {
      setShowDropdown(false);
    }
  };

  const handleRemoveItem = (itemName: string) => {
    if (selectionMode === 'multiple') {
      const updatedItems = (selectedItems as string[]).filter(
        (name: string) => name !== itemName
      );
      form.setValue(fieldName, updatedItems);
    } else {
      form.setValue(fieldName, '');
    }
  };

  return (
    <div>
      <div className="col-span-12 flex items-end space-x-2 relative">
        <Controller
          name={`${fieldName}Input`}
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-grow relative">
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input
                  value={field.value ?? ''}
                  placeholder={placeholder}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleItemSearch(e.target.value);
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
                  {searchedItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onMouseDown={() => handleSelectItem(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}

              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Display Selected Items (Tags or Single Value) */}
      <div className="col-span-12 flex justify-start">
        <div className="bg-white p-2 rounded-md min-w-fit w-auto">
          {selectionMode === 'multiple'
            ? (selectedItems as string[]).map((item: string, index: any) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-1 text-sm bg-gray-100 rounded-md mb-2 px-3"
                >
                  <span className="whitespace-nowrap">{item}</span>
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="text-gray-500 hover:text-red-500 transition"
                  >
                    <X className="ml-3" size={14} strokeWidth={4} />
                  </button>
                </div>
              ))
            : typeof selectedItems === 'string' &&
              selectedItems && (
                <div className="p-1 text-sm bg-gray-100 rounded-md px-3">
                  {selectedItems}
                </div>
              )}
        </div>
      </div>
    </div>
  );
};
