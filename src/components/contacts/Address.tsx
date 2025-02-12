import React, { useState, useCallback, useEffect } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import { SearchableSelectWithTags } from '@/components/SearchableSelectWithTags';

interface Location {
  city: string;
  state: string | null;
  country: string | null;
}

interface AddressProps {
  form: UseFormReturn<any>;
}

const Address: React.FC<AddressProps> = ({ form }) => {
  const [cityOptions, setCityOptions] = useState<Location[]>([]);
  const [cityNamesForDropdown, setCityNamesForDropdown] = useState<string[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState<string>('');

  const locationsQuery = trpc.location.getAllLocations.useQuery(searchTerm, {
    enabled: searchTerm.length > 0,
    onSuccess: (data) => {
      setCityOptions(data);
    },
  });

  useEffect(() => {
    if (locationsQuery.data) {
      const names = locationsQuery.data.map(
        (location: Location) => location.city
      );
      setCityNamesForDropdown(names);
    } else {
      setCityNamesForDropdown([]);
    }
  }, [locationsQuery.data]);

  const handleCitySearch = useCallback(
    (search: string) => {
      setSearchTerm(search);
    },
    [setSearchTerm]
  );

  const handleCitySelect = useCallback(
    (selectedCityName: string) => {
      const selectedLocation = cityOptions.find(
        (city) => city.city === selectedCityName
      );
      if (selectedLocation) {
        form.setValue('cityLocation', selectedLocation.city);
        form.setValue('stateRegion', selectedLocation.state ?? '');
        form.setValue('country', selectedLocation.country ?? '');
      } else {
        console.warn('Selected city not found in options:', selectedCityName);
      }
    },
    [cityOptions, form.setValue]
  );

  return (
    <div>
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cityLocationInput"
        render={() => (
          <FormItem>
            <FormControl>
              <SearchableSelectWithTags
                form={form}
                fieldName="cityLocation"
                label="City/Location"
                placeholder="Search City and Select"
                Values={cityNamesForDropdown}
                onSearch={handleCitySearch}
                selectionMode="single"
                onSelectItem={handleCitySelect}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="stateRegion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State/Region</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default Address;
