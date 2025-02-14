import React, { useCallback, useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import { SearchableSelect } from '@/components/SearchableSelectWithTags';
import { X } from 'lucide-react';

interface getAcademyNamesRes {
  id: string;
  name: string;
}

export const AcademyNames: React.FC<{ form: UseFormReturn<any> }> = ({
  form,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const {
    data: academyNamesData,
    error,
    refetch, // 🔥 Use refetch when search term changes
  } = trpc.academy.getAcademyNames.useQuery(searchTerm, {
    enabled: true, // ✅ Always enabled to allow initial fetch
  });

  useEffect(() => {
    if (searchTerm.length > 0) {
      refetch(); // 🔥 Refetch data when search term updates
    }
  }, [searchTerm, refetch]);

  if (error) {
    return <div>Error loading academy names: {error.message}</div>;
  }

  // Watch selected academy IDs & names
  const selectedAcademyIds: string[] = form.watch('academyIds') || [];
  const selectedAcademyNames: string[] = form.watch('academyNames') || [];

  useEffect(() => {
    if (academyNamesData) {
      const selectedNames = selectedAcademyIds
        .map(
          (id) => academyNamesData.find((academy) => academy.id === id)?.name
        )
        .filter(Boolean) as string[];
      form.setValue('academyNames', selectedNames);
    }
  }, [selectedAcademyIds, academyNamesData, form]);

  const handleOnSelect = (selectedAcademy: getAcademyNamesRes) => {
    if (!academyNamesData) return;

    const updatedIds = [...selectedAcademyIds];
    const updatedNames = [...selectedAcademyNames];

    if (!updatedIds.includes(selectedAcademy.id)) {
      updatedIds.push(selectedAcademy.id);
      updatedNames.push(selectedAcademy.name);
      form.setValue('academyIds', updatedIds);
      form.setValue('academyNames', updatedNames);
    }
  };

  const handleRemoveTag = (index: number) => {
    const updatedIds = [...selectedAcademyIds];
    const updatedNames = [...selectedAcademyNames];

    updatedIds.splice(index, 1);
    updatedNames.splice(index, 1);

    form.setValue('academyIds', updatedIds);
    form.setValue('academyNames', updatedNames);
  };

  const onSearch = useCallback((search: string) => {
    setSearchTerm(search); // ✅ This will trigger refetch in useEffect
  }, []);

  return (
    <div>
      <SearchableSelect<getAcademyNamesRes>
        form={form}
        fieldName="academyNames"
        label="Academy Names"
        placeholder="Search Academy and Select"
        data={academyNamesData || []}
        displayKey="name"
        selectionMode="multiple"
        onSelectItem={handleOnSelect}
        onSearch={onSearch}
      />

      {/* Render Selected Academy Tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        {selectedAcademyNames.length > 0 ? (
          selectedAcademyNames.map((academy, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-200 px-3 py-1 rounded-lg"
            >
              <span>{academy}</span>
              <button onClick={() => handleRemoveTag(index)} className="ml-2">
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
            No languages added yet.
          </div>
        )}
      </div>
    </div>
  );
};
