import AddLocation from '@/components/contacts/tagbasedfields/AddLocation';
import { SearchableSelect } from '@/components/SearchableSelect';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { trpc } from '@/utils/trpc';
import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface Location {
  id: number;
  country: string | null;
  state: string | null;
  city: string;
}

export const PhysicallyTaught: React.FC<{
  form: UseFormReturn<any>;
  initialLocationIds?: number[] | null;
}> = ({ form, initialLocationIds }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] =
    useState<boolean>(false);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [isFocused, setIsFocused] = useState(false); // Add focus state

  const {
    data: locationsData,
    error,
    isLoading,
  } = trpc.location.getAllLocations.useQuery(searchTerm, {
    enabled: isFocused,
  });

  const { data: initialLocations, isLoading: initialLocationsLoading } =
    trpc.location.getById.useQuery(initialLocationIds || [], {
      enabled:
        Array.isArray(initialLocationIds) && initialLocationIds.length > 0,
    });

  useEffect(() => {
    if (initialLocations && initialLocations.length > 0) {
      setSelectedLocations(
        initialLocations.filter(
          (location): location is Location => location !== null
        )
      );
      form.setValue(
        'physicallyTaught',
        initialLocations
          .map((location) => location?.id)
          .filter((id) => id !== undefined)
      );
    }
  }, [initialLocations, form]);

  const onSearch = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  const onClick = useCallback(() => {
    setIsAddLocationModalOpen(true);
  }, []);

  const handleLocationSelect = useCallback(
    (location: Location) => {
      setSelectedLocations((prevLocations) => {
        if (prevLocations.some((loc) => loc.id === location.id)) {
          return prevLocations;
        }
        return [...prevLocations, location];
      });
      const locationId = location.id;
      const currentPhysicallyTaughtIds = form.watch('physicallyTaught') || [];
      const physicallyTaughtIdsArray = Array.isArray(currentPhysicallyTaughtIds)
        ? currentPhysicallyTaughtIds
        : [];
      if (!physicallyTaughtIdsArray.includes(locationId)) {
        form.setValue('physicallyTaught', [
          ...physicallyTaughtIdsArray,
          locationId,
        ]);
      }
    },
    [form]
  );

  const handleRemoveLocation = useCallback(
    (index: number) => {
      setSelectedLocations((prevLocations) => {
        const updatedLocations = [...prevLocations];
        updatedLocations.splice(index, 1);
        return updatedLocations;
      });
      form.setValue(
        'physicallyTaught',
        selectedLocations
          .filter((_, i) => i !== index)
          .map((location) => location.id)
      );
    },
    [form, selectedLocations]
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setSearchTerm(''); // Reset search term on blur
  }, []);

  if (error) {
    return <div>Error loading locations: {error.message}</div>;
  }

  if (initialLocationsLoading && initialLocationIds?.length) {
    return <div>Loading initial locations...</div>;
  }

  return (
    <div>
      <SearchableSelect<Location>
        form={form}
        fieldName="physicallyTaughtNames"
        label="Physical Locations Taught"
        placeholder="Search locations..."
        data={locationsData || []}
        displayKey="city"
        selectionMode="multiple"
        onSelectItem={handleLocationSelect}
        onSearch={onSearch}
        onClick={onClick}
        showButton
        isLoading={isLoading}
        onFocus={handleFocus} // Pass focus handler
        onBlur={handleBlur} // Pass blur handler
      />
      <div className="flex flex-wrap gap-2 mt-3">
        {selectedLocations.length > 0 ? (
          selectedLocations.map((location, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-200 px-3 py-1 rounded-lg"
            >
              <span>{location.city}</span>
              <button
                onClick={() => handleRemoveLocation(index)}
                className="ml-2"
              >
                <X
                  size={14}
                  className="text-gray-600 hover:text-red-500"
                  strokeWidth={3}
                />
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm italic">
            No Locations added yet.
          </div>
        )}
      </div>
      <Dialog
        open={isAddLocationModalOpen}
        onOpenChange={setIsAddLocationModalOpen}
      >
        <DialogContent className="max-w-md">
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
        </DialogContent>
      </Dialog>
    </div>
  );
};
