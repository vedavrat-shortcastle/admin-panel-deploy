import React, { useCallback, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import { SearchableSelectWithTags } from '@/components/SearchableSelectWithTags';

// Define the type for Academy Names response (adjust to your actual API response)
interface getAcademyNamesRes {
  id: string;
  name: string;
}

export const AcademyNames: React.FC<{ form: UseFormReturn<any> }> = ({
  form,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data: academyNamesData, error } =
    trpc.academy.getAcademyNames.useQuery(searchTerm, {
      enabled: searchTerm.length > 0,
    }); // Initial search term can be empty

  if (error) {
    return <div>Error loading academy names: {error.message}</div>; // Or error handling
  }

  const handleOnSelect = (selectedAcademy: getAcademyNamesRes) => {
    if (!academyNamesData) {
      console.log('no academy data available on select'); // Should not happen usually as we have loading check
      return;
    }

    console.log('Selected academy object:', selectedAcademy);

    // Get the current academyIds from the form
    const currentAcademyIds = form.watch('academyIds') || [];

    // Check if academyIds is an array, if not initialize it
    const academyIdsArray = Array.isArray(currentAcademyIds)
      ? currentAcademyIds
      : [];

    // Add the selected academy's id to the academyIds array
    if (!academyIdsArray.includes(selectedAcademy.id)) {
      form.setValue('academyIds', [...academyIdsArray, selectedAcademy.id]);
    } else {
      console.log('Academy ID already added:', selectedAcademy.id);
    }
  };

  const onSearch = useCallback(
    (search: string) => {
      setSearchTerm(search);
    },
    [setSearchTerm]
  );

  return (
    <div>
      <SearchableSelectWithTags<getAcademyNamesRes> // Specify generic type
        form={form}
        fieldName="academyNames" // Form field name to store display names (string array)
        label="Academy Names (Multiple)"
        placeholder="Search Academy and Select"
        data={academyNamesData || []} // Pass fetched academy data
        displayKey="name" // Display 'name' from getAcademyNamesRes objects
        selectionMode="multiple"
        onSelectItem={handleOnSelect} // Handle selected academy object
        // onSearch prop is intentionally removed as SearchableSelectWithTags handles search internally now
        onSearch={onSearch}
      />
    </div>
  );
};
