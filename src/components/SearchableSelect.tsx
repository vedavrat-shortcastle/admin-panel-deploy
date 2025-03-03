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
import { Loader2 } from 'lucide-react';

export type SelectionMode = 'single' | 'multiple';

interface SearchableSelectWithTagsProps<T extends Record<string, any>> {
  form: UseFormReturn<any>;
  fieldName: string;
  data?: T[];
  displayKey: keyof T | (keyof T)[];
  label?: string;
  placeholder?: string;
  selectionMode?: SelectionMode;
  onSearch?: (searchTerm: string) => void;
  onSelectItem?: (item: T) => void;
  onClick?: (searchTerm: string) => void;
  showButton?: boolean;
  isLoading?: boolean;
  onFocus?: () => void; // Add onFocus prop
  onBlur?: () => void; // Add onBlur prop
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
  isLoading = false,
  onFocus,
  onBlur,
}: SearchableSelectWithTagsProps<T>) => {
  const [apiData, setApiData] = useState<T[]>(initialData || []);
  const [searchedItems, setSearchedItems] = useState<T[]>(initialData || []);
  const [isFocused, setIsFocused] = useState(false);
  const isMounted = useRef(true);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const selectedItems =
    form.watch(fieldName) || (selectionMode === 'multiple' ? [] : '');
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    setApiData(initialData || []);
    setSearchedItems(initialData || []);
  }, [initialData]);

  useEffect(() => {
    const trimmedInput = inputValue.trim().toLowerCase();
    if (!trimmedInput || !isFocused) {
      setSearchedItems(apiData);
      setShowDropdown(apiData.length > 0 && isFocused);
    } else {
      const filteredItems = apiData.filter((item) =>
        Array.isArray(displayKey)
          ? displayKey.some((key) =>
              String(item[key]).toLowerCase().includes(trimmedInput)
            )
          : String(item[displayKey]).toLowerCase().includes(trimmedInput)
      );
      setSearchedItems(filteredItems);
      setShowDropdown(filteredItems.length > 0);
    }
  }, [inputValue, apiData, displayKey, isFocused]);

  const handleItemSearch = useCallback(
    debounce((value: string) => {
      if (isFocused) {
        // Only search when focused
        setInputValue(value);
        onSearch?.(value.trim());
        setShowDropdown(true);
      }
    }, 500),
    [onSearch, isFocused]
  );

  const handleSelectItem = (item: T) => {
    const displayValue = Array.isArray(displayKey)
      ? displayKey.map((key) => String(item[key])).join(' ')
      : String(item[displayKey]);
    form.setValue(`${fieldName}Input`, '');

    if (selectionMode === 'multiple') {
      if (!(selectedItems as string[]).includes(displayValue)) {
        form.setValue(fieldName, [...selectedItems, displayValue]);
      }
      setInputValue('');
    } else {
      form.setValue(fieldName, displayValue);
      setInputValue(displayValue);
    }

    setShowDropdown(false);
    onSelectItem?.(item);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.(); // Call parent onFocus if provided
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (isMounted.current) {
        setShowDropdown(false);
        setIsFocused(false);
        setInputValue(''); // Reset input on blur
        onBlur?.(); // Call parent onBlur if provided
      }
    }, 200);
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
                <div className="relative">
                  <Input
                    value={field.value ?? ''}
                    placeholder={placeholder}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      handleItemSearch(e.target.value);
                    }}
                    onFocus={handleFocus} // Add focus handler
                    onBlur={handleBlur} // Update blur handler
                    name={field.name}
                    ref={field.ref}
                  />
                  {isLoading && inputValue.trim() !== '' && (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <Loader2 className="animate-spin h-4 w-4" />
                    </div>
                  )}
                </div>
              </FormControl>

              {showDropdown && (
                <div className="absolute left-0 right-0 bg-white border border-gray-300 shadow-lg mt-1 rounded-md max-h-40 overflow-y-auto z-10">
                  {searchedItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onMouseDown={() => handleSelectItem(item)}
                    >
                      {Array.isArray(displayKey)
                        ? displayKey.map((key) => String(item[key])).join(' ')
                        : String(item[displayKey])}
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
