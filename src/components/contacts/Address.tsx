import AddLocation from '@/components/contacts/tagbasedfields/AddLocation'; // Make sure this import is correct

import { SearchableSelectWithTags } from '@/components/SearchableSelectWithTags';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { trpc } from '@/utils/trpc';
import { useCallback, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface Location {
  id: number;
  country: string | null;
  state: string | null;
  city: string;
}

export const Address: React.FC<{ form: UseFormReturn<any> }> = ({ form }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] =
    useState<boolean>(false); // ADD THIS LINE - Modal state

  const { data: locationsData, error } = trpc.location.getAllLocations.useQuery(
    searchTerm,
    {
      enabled: searchTerm.length > 0,
    }
  );

  const onSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setHasSearched(true);
  }, []);

  const handleLocationSelect = useCallback(
    (selectedLocation: Location) => {
      console.log('This is selected location', selectedLocation);
      const locationId = selectedLocation.id;

      const currentCityId = form.watch('locationId') || [];
      const cityIdsArray = Array.isArray(currentCityId) ? currentCityId : [];

      if (!cityIdsArray.includes(locationId)) {
        console.log('This is location ID', locationId);
        form.setValue('locationId', [...cityIdsArray, locationId]);
        form.setValue('cityLocation', selectedLocation.city);
      } else {
        console.log('Location ID already added:', locationId);
      }
    },
    [form]
  );

  if (error) {
    return <div>Error loading locations: {error.message}</div>;
  }

  return (
    <div className="grid items-center space-x-2 relative">
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium">Address</FormLabel>
            <FormControl>
              <Input
                type="text"
                className="w-full"
                {...field}
                value={field.value || ''} // Ensure it's a string
                onChange={(e) => field.onChange(e.target.value)} // Handle text input properly
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <SearchableSelectWithTags<Location>
        form={form}
        fieldName="cityLocation"
        label="City"
        placeholder="Search City..."
        data={locationsData || []}
        displayKey="city"
        selectionMode="single"
        onSelectItem={handleLocationSelect}
        onSearch={onSearch}
      />

      {hasSearched && (!locationsData || locationsData.length === 0) && (
        <Dialog
          open={isAddLocationModalOpen}
          onOpenChange={setIsAddLocationModalOpen}
        >
          <DialogTrigger asChild>
            <Button>Add Location</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Add New Location
                </DialogTitle>
              </DialogHeader>
              <div
                className="overflow-y-auto p-5 flex-grow"
                style={{ maxHeight: 'calc(100vh - 150px)' }}
              >
                <AddLocation />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
