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

interface SearchableSelectWithTagsProps<T extends Record<string, any>> {
  form: UseFormReturn<any>;
  fieldName: string;
  data: T[]; // <--  `data` prop to receive API response from parent
  displayKey: keyof T;
  label?: string;
  placeholder?: string;
  selectionMode?: SelectionMode;
  onSearch?: (searchTerm: string) => void;
  onSelectItem?: (item: T) => void;
}

export const SearchableSelectWithTags = <T extends Record<string, any>>({
  form,
  fieldName,
  data: initialData,
  displayKey,
  label,
  placeholder,
  selectionMode = 'multiple',
  onSearch,
  onSelectItem,
}: SearchableSelectWithTagsProps<T>) => {
  const [apiData, setApiData] = useState<T[]>(initialData || []);
  const [searchedItems, setSearchedItems] = useState<T[]>(initialData || []);
  const isMounted = useRef(true);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const selectedItems =
    form.watch(fieldName) || (selectionMode === 'multiple' ? [] : '');
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setApiData(initialData || []);
    setSearchedItems(initialData || []);
    setShowDropdown(Boolean(initialData?.length)); // More concise boolean conversion
  }, [initialData]);

  useEffect(() => {
    const trimmedInputValue = inputValue.trim();
    if (!trimmedInputValue) {
      setSearchedItems(apiData);
      setShowDropdown(Boolean(apiData.length)); // More concise boolean conversion
    } else {
      const filteredItems = apiData.filter((item) =>
        String(item[displayKey])
          .toLowerCase()
          .includes(trimmedInputValue.toLowerCase())
      );
      setSearchedItems(filteredItems);
      setShowDropdown(filteredItems.length > 0 || Boolean(trimmedInputValue)); // Concise condition
    }
  }, [inputValue, apiData, displayKey]);

  const handleItemSearch = useCallback(
    debounce((value: string) => {
      setInputValue(value);
      const searchValue = value.trim().toLowerCase();
      setSearchedItems(searchValue === '' ? apiData : searchedItems); //  Directly use searchedItems which will be updated by useEffect
      setShowDropdown(
        searchValue === '' ? Boolean(apiData.length) : showDropdown
      ); // rely on useEffect to set showDropdown
      onSearch?.(searchValue === '' ? '' : searchValue); // Optional chaining for onSearch
    }, 500),
    [onSearch, selectionMode, apiData, searchedItems, showDropdown] // added searchedItems, showDropdown to dependency array, though might not be needed.
  );

  const handleSelectItem = (item: T) => {
    const displayValue = String(item[displayKey]);
    form.setValue(`${fieldName}Input`, ''); // Clear input always

    if (selectionMode === 'multiple') {
      if (!(selectedItems as string[]).includes(displayValue)) {
        form.setValue(fieldName, [...selectedItems, displayValue]);
      } else {
        console.log('Item already selected:', displayValue);
      }
    } else {
      form.setValue(fieldName, displayValue);
      setInputValue(displayValue);
    }
    setShowDropdown(false); // Hide dropdown in both single and multiple select
    onSelectItem?.(item); // Optional chaining for onSelectItem
  };

  const handleRemoveItem = (itemName: string) => {
    const updatedItems = (selectedItems as string[]).filter(
      (name: string) => name !== itemName
    );
    form.setValue(fieldName, updatedItems);
    if (selectionMode !== 'multiple') {
      // Only for single mode, though this case might not be relevant anymore
      setInputValue('');
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
                  value={
                    selectionMode === 'single'
                      ? inputValue
                      : (field.value ?? '')
                  }
                  placeholder={placeholder}
                  onChange={(e) => {
                    if (selectionMode === 'single') {
                      setInputValue(e.target.value);
                    } else {
                      field.onChange(e.target.value);
                    }
                    handleItemSearch(e.target.value);
                  }}
                  onBlur={() =>
                    setTimeout(
                      () => isMounted.current && setShowDropdown(false),
                      200
                    )
                  } // More concise timeout
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>

              {showDropdown && searchedItems.length > 0 && (
                <div className="absolute left-0 right-0 bg-white border border-gray-300 shadow-lg mt-1 rounded-md max-h-40 overflow-y-auto z-10">
                  {searchedItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onMouseDown={() => handleSelectItem(item)}
                    >
                      {String(item[displayKey])}
                    </div>
                  ))}
                </div>
              )}

              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-12 flex justify-start">
        <div className="bg-white p-2 rounded-md min-w-fit w-auto">
          {selectionMode === 'multiple' &&
            (selectedItems as string[]).map((item: string, index: any) => (
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
            ))}
        </div>
      </div>
    </div>
  );
};
