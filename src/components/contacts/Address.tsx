import AddLocation from '@/components/contacts/tagbasedfields/AddLocation';
import { SearchableSelect } from '@/components/SearchableSelect';

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
  const [isLocationSelected, setIsLocationSelected] = useState<boolean>(false);
  const [locationsData, setLocationsData] = useState<Location[] | undefined>(
    undefined
  ); // Store data locally

  const { refetch } = trpc.location.getAllLocations.useQuery(searchTerm, {
    enabled: hasSearched,
    onSuccess: (data) => setLocationsData(data), // Update local state on success
  });

  const onSearch = useCallback(
    (search: string) => {
      setSearchTerm(search);
      setHasSearched(true);
      refetch();
    },
    [refetch]
  );

  const handleLocationSelect = useCallback(
    (selectedLocation: Location) => {
      console.log('Selected location:', selectedLocation);
      const locationId = selectedLocation.id;

      form.setValue('locationId', locationId);
      form.setValue('cityLocation', selectedLocation.city);
      form.setValue('cityLocationInput', selectedLocation.city);
      form.setValue('stateRegion', selectedLocation.state || '');
      form.setValue('country', selectedLocation.country || '');
      setIsLocationSelected(true);
      setSearchTerm(''); // Clear search for next search
      setHasSearched(false); // Reset for next search
      setLocationsData(undefined); // Clear displayed locations
    },
    [form]
  );

  const onClick = useCallback(() => {
    setIsAddLocationModalOpen(true);
  }, []);

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
