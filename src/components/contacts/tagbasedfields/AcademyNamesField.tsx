import React, { useState, useCallback, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import { SearchableSelectWithTags } from '@/components/SearchableSelectWithTags';

interface getAcademyNamesRes {
  id: string;
  name: string;
}

export const AcademyNames: React.FC<{ form: UseFormReturn<any> }> = ({
  form,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [academyNamesForDropdown, setAcademyNamesForDropdown] = useState<
    string[]
  >([]);

  const academies = trpc.academy.getAcademyNames.useQuery(searchTerm, {
    enabled: searchTerm.length > 0,
  });

  useEffect(() => {
    setAcademyNamesForDropdown(
      academies.data?.map((academy: getAcademyNamesRes) => academy.name) ?? []
    );
  }, [academies.data, searchTerm]);

  const handleAcademySearch = useCallback(
    (search: string) => {
      setSearchTerm(search);
    },
    [setSearchTerm]
  );

  const handleOnSelect = useCallback(
    (selectedAcademyName: string) => {
      if (!academies.data) {
        console.log('no academy data');
        return;
      }
      console.log(academies.data);
      // Find the academy object that matches the selected name
      const selectedAcademy = academies.data.find(
        (academy) => academy.name === selectedAcademyName
      );

      if (selectedAcademy) {
        console.log('this is selected academy', selectedAcademy);
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
      } else {
        console.warn(
          'Selected academy name not found in academy data:',
          selectedAcademyName
        );
      }
    },
    [academies.data, form.setValue, form.watch]
  );

  return (
    <SearchableSelectWithTags
      form={form}
      fieldName="academyNames"
      label="Academy Names (Multiple)"
      placeholder="Search Academy and Select"
      Values={academyNamesForDropdown}
      onSearch={handleAcademySearch}
      onSelectItem={handleOnSelect}
      selectionMode="multiple"
    />
  );
};
