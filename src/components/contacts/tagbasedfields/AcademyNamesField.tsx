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

  return (
    <SearchableSelectWithTags
      form={form}
      fieldName="academyNames"
      label="Academy Names (Multiple)"
      placeholder="Search Academy and Select"
      Values={academyNamesForDropdown}
      onSearch={handleAcademySearch}
      selectionMode="multiple"
    />
  );
};
