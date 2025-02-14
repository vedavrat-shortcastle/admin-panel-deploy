import React, { useState, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import { SearchableSelect } from '@/components/SearchableSelect';

interface getAcademyNamesRes {
  id: string;
  name: string;
}

export const CurrentAcademy: React.FC<{ form: UseFormReturn<any> }> = ({
  form,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [academyData, setAcademyData] = useState<
    getAcademyNamesRes[] | undefined
  >(undefined);

  const { refetch } = trpc.academy.getAcademyNames.useQuery(searchTerm, {
    enabled: hasSearched,
    onSuccess: (data) => setAcademyData(data),
  });

  const onSearch = useCallback(
    (search: string) => {
      setSearchTerm(search);
      setHasSearched(true);
      refetch();
    },
    [refetch]
  );

  const handleOnSelect = (selectedAcademy: getAcademyNamesRes) => {
    if (!academyData) return;
    form.setValue('currentAcademyInput', selectedAcademy.name);
    form.setValue('currentAcademy', selectedAcademy.id);
    setSearchTerm('');
  };

  return (
    <div>
      <SearchableSelect<getAcademyNamesRes>
        form={form}
        fieldName="currentAcademy"
        label="Current Academy"
        placeholder="Search Academy and Select"
        data={academyData || []}
        displayKey="name"
        selectionMode="single"
        onSelectItem={handleOnSelect}
        onSearch={onSearch}
      />
    </div>
  );
};
