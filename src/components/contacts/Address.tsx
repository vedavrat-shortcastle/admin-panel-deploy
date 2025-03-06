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
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] =
    useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false); // Add focus state

  const { data: locationsData, isLoading } =
    trpc.location.getAllLocations.useQuery(searchTerm, {
      enabled: isFocused && searchTerm.length > 0, // Fetch only when focused and search term exists
    });

  // Set initial city input only once on mount or when it changes
  const initialCityInput = form.watch('location.city');
  useEffect(() => {
    if (initialCityInput) {
      form.setValue('cityInput', initialCityInput);
    }
  }, [initialCityInput, form]);

  const onSearch = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  const handleLocationSelect = useCallback(
    (selectedLocation: Location) => {
      const locationId = selectedLocation.id;
      form.setValue('locationId', locationId);
      form.setValue('location.city', selectedLocation.city);
      form.setValue('cityInput', selectedLocation.city);
      form.setValue('location.state', selectedLocation.state || '');
      form.setValue('location.country', selectedLocation.country || '');
    },
    [form]
  );

  const onClick = useCallback(() => {
    setIsAddLocationModalOpen(true);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setSearchTerm(''); // Reset search term on blur
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
        onFocus={handleFocus} // Pass focus handler
        onBlur={handleBlur} // Pass blur handler
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
