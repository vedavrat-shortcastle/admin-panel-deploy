import React, { useState, useCallback } from 'react';
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
  id: number;
  city: string;
  state: string | null;
  country: string | null;
}

interface AddressProps {
  form: UseFormReturn<any>;
}

const Address: React.FC<AddressProps> = ({ form }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch locations based on search term
  const { data: locations = [] } = trpc.location.getAllLocations.useQuery(
    searchTerm,
    { enabled: searchTerm.length > 0 }
  );

  // Extract city names for dropdown

  const handleCitySearch = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  const handleCitySelect = useCallback(
    (selectedCityDetails: Location) => {
      console.log('selectedcitydetails', selectedCityDetails);
      if (selectedCityDetails) {
        form.setValue('cityLocation', selectedCityDetails.city);
        form.setValue('stateRegion', selectedCityDetails.state ?? '');
        form.setValue('country', selectedCityDetails.country ?? '');
        form.setValue('locationId', selectedCityDetails.id);
      } else {
        console.warn(
          'Selected city not found in options:',
          selectedCityDetails
        );
      }
    },
    [locations, form]
  );

  return (
    <div>
      {/* Address Field */}
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

      {/* City Dropdown */}
      <FormField
        control={form.control}
        name="cityLocation"
        render={() => (
          <FormItem>
            <FormLabel>City/Location</FormLabel>
            <FormControl>
              <SearchableSelectWithTags
                form={form}
                displayKey="city"
                fieldName="cityLocation"
                placeholder="Search City and Select"
                data={locations}
                selectionMode="single"
                onSearch={handleCitySearch}
                onSelectItem={handleCitySelect}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* State & Country Fields */}
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
