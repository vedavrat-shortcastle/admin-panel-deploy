import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { debounce } from 'lodash';

export type SelectionMode = 'single' | 'multiple';

interface SearchableSelectWithTagsProps<T extends Record<string, any>> {
  form: UseFormReturn<any>; // React Hook Form instance
  fieldName: string; // Field name in form state
  data?: T[]; // List of selectable items
  displayKey: keyof T; // Key used to display items in dropdown
  label?: string; // Input label
  placeholder?: string; // Input placeholder
  selectionMode?: SelectionMode; // Selection mode (single/multiple)
  onSearch?: (searchTerm: string) => void; // Callback for search
  onSelectItem?: (item: T) => void; // Callback for selection
  onClick?: (searchTerm: string) => void; // Callback for button click
  showButton?: boolean;
}

export const SearchableSelect = <T extends Record<string, any>>({
  form,
  fieldName,
  data: initialData,
  displayKey,
  label,
  placeholder,
  selectionMode = 'multiple',
  onSearch,
  onSelectItem,
  onClick,
  showButton = false,
}: SearchableSelectWithTagsProps<T>) => {
  const [apiData, setApiData] = useState<T[]>(initialData || []);
  const [searchedItems, setSearchedItems] = useState<T[]>(initialData || []);
  const isMounted = useRef(true);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const selectedItems =
    form.watch(fieldName) || (selectionMode === 'multiple' ? [] : '');
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    setApiData(initialData || []);
    setSearchedItems(initialData || []);
    setShowDropdown((initialData ?? []).length > 0);
  }, [initialData]);

  useEffect(() => {
    const trimmedInput = inputValue.trim().toLowerCase();
    if (!trimmedInput) {
      setSearchedItems(apiData);
      setShowDropdown(apiData.length > 0);
    } else {
      const filteredItems = apiData.filter((item) =>
        String(item[displayKey]).toLowerCase().includes(trimmedInput)
      );
      setSearchedItems(filteredItems);
      setShowDropdown(filteredItems.length > 0);
    }
  }, [inputValue, apiData, displayKey]);

  // const handleItemSearch = useCallback(
  //   debounce((value: string) => {
  //     if (!isMounted.current) return;
  //     setInputValue(value);
  //     onSearch?.(value.trim());
  //     setShowDropdown(true);
  //   }, 500),
  //   [onSearch]
  // );

  const handleItemSearch = useCallback(
    debounce((value: string) => {
      // if (!isMounted.current) return;
      setInputValue(value);
      onSearch?.(value.trim());
      setShowDropdown(true);
    }, 500), // Delay is now 200ms
    [onSearch]
  );

  const handleSelectItem = (item: T) => {
    const displayValue = String(item[displayKey]);
    form.setValue(`${fieldName}Input`, '');

    if (selectionMode === 'multiple') {
      if (!(selectedItems as string[]).includes(displayValue)) {
        form.setValue(fieldName, [...selectedItems, displayValue]);
      }
    } else {
      form.setValue(fieldName, displayValue);
      setInputValue(displayValue);
    }

    setShowDropdown(false);
    onSelectItem?.(item);
  };

  return (
    <div className="flex gap-3">
      <div className="col-span-12 flex flex-grow items-end space-x-2 relative">
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
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() =>
                    setTimeout(
                      () => isMounted.current && setShowDropdown(false),
                      200
                    )
                  }
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>

              {showDropdown &&
                Array.isArray(searchedItems) &&
                searchedItems.length > 0 && (
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
      {showButton && (
        <div className="mt-2 flex items-end">
          <Button onClick={() => onClick?.(inputValue)}>Add {label}</Button>
        </div>
      )}
    </div>
  );
};
