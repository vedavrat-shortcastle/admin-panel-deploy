import AddLocation from '@/components/contacts/tagbasedfields/AddLocation';
import { SearchableSelect } from '@/components/SearchableSelect';
import { useEffect } from 'react';
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
  );

  const initialCityInput = form.watch('location.city');
  form.setValue('cityInput', initialCityInput);

  const { refetch, isLoading } = trpc.location.getAllLocations.useQuery(
    searchTerm,
    {
      enabled: hasSearched,
      onSuccess: (data) => setLocationsData(data),
    }
  );
  useEffect(() => {
    if (hasSearched) {
      refetch();
    }
  }, [searchTerm, hasSearched, refetch]);
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
      const locationId = selectedLocation.id;

      form.setValue('locationId', locationId);
      form.setValue('city', selectedLocation.city);
      form.setValue('cityInput', selectedLocation.city);
      form.setValue('state', selectedLocation.state || '');
      form.setValue('country', selectedLocation.country || '');
      setIsLocationSelected(true);
      setSearchTerm('');
      setHasSearched(false);
      setLocationsData(undefined);
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
        fieldName="city"
        label="City"
        placeholder="Search City..."
        data={locationsData || []}
        displayKey="city"
        selectionMode="single"
        onSelectItem={handleLocationSelect}
        onSearch={onSearch}
        showButton
        onClick={onClick}
        isLoading={isLoading}
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
          name="location.state"
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
                  disabled={isLocationSelected}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location.country"
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
                  disabled={isLocationSelected}
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
