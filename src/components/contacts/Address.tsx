import AddLocation from '@/components/contacts/tagbasedfields/AddLocation'; // Make sure this import is correct
import { SearchableSelect } from '@/components/SearchableSelectWithTags';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
    useState<boolean>(false);
  const [isLocationSelected, setIsLocationSelected] = useState<boolean>(false); // Track if a location is selected

  const { data: locationsData, error } = trpc.location.getAllLocations.useQuery(
    searchTerm,
    {
      enabled: true,
    }
  );

  const onSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setHasSearched(true);
  }, []);

  const handleLocationSelect = useCallback(
    (selectedLocation: Location) => {
      console.log('Selected location:', selectedLocation);
      const locationId = selectedLocation.id;

      form.setValue('locationId', locationId);
      form.setValue('cityLocation', selectedLocation.city);
      form.setValue('stateRegion', selectedLocation.state || ''); // Auto-fill state
      form.setValue('country', selectedLocation.country || ''); // Auto-fill country
      setIsLocationSelected(true); // Disable fields when location is set
    },
    [form]
  );

  const onClick = useCallback(() => {
    setIsAddLocationModalOpen(true);
  }, []);

  if (error) {
    return <div>Error loading locations: {error.message}</div>;
  }

  return (
    <div className="space-y-2">
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
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <SearchableSelect<Location>
        form={form}
        fieldName="cityLocation"
        label="City"
        placeholder="Search City..."
        data={locationsData || []}
        displayKey="city"
        selectionMode="single"
        onSelectItem={handleLocationSelect}
        onSearch={onSearch}
        showButton
        onClick={onClick}
      />

      {hasSearched && (!locationsData || locationsData.length === 0) && (
        <Dialog
          open={isAddLocationModalOpen}
          onOpenChange={setIsAddLocationModalOpen}
        >
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

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="stateRegion"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">State/Region</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="w-full"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={isLocationSelected} // Disable when a location is selected
                />
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
              <FormLabel className="font-medium">Country</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="w-full"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={isLocationSelected} // Disable when a location is selected
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
