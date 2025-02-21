import React, { useState, useEffect } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import { X } from 'lucide-react';
import { SearchableSelect } from '@/components/SearchableSelect';

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
    isLoading,
  } = trpc.academy.getAcademyNames.useQuery(searchTerm, {
    enabled: searchTerm.length > 0,
  });

  if (error) {
    return <div>Error loading academy names: {error.message}</div>;
  }

  const selectedAcademyIds = useWatch({
    control: form.control,
    name: 'academyIds',
    defaultValue: [],
  });
  const selectedAcademyNames = useWatch({
    control: form.control,
    name: 'academyNames',
    defaultValue: [],
  });

  useEffect(() => {
    if (academyNamesData) {
      const selectedNames = selectedAcademyIds
        .map(
          (id: string) =>
            academyNamesData.find((academy) => academy.id === id)?.name
        )
        .filter(Boolean) as string[];

      form.setValue('academyNames', [
        ...new Set([...selectedAcademyNames, ...selectedNames]),
      ]);
    }
  }, [selectedAcademyIds, academyNamesData, form]);

  const handleOnSelect = (selectedAcademy: getAcademyNamesRes) => {
    if (mode === 'multiple') {
      if (!selectedNames.includes(selectedAcademy.name)) {
        form.setValue('academyIds', [...selectedIds, selectedAcademy.id]);
        form.setValue('academyNames', [...selectedNames, selectedAcademy.name]);
      }
    } else {
      form.setValue('academyId', selectedAcademy.id);
      form.setValue('academyName', selectedAcademy.name);
      form.setValue('academyNameInput', selectedAcademy.name);
    }
    setSearchTerm('');
  };

  const handleRemoveTag = (index: number) => {
    const updatedIds = [...selectedAcademyIds];
    const updatedNames = [...selectedAcademyNames];

    updatedIds.splice(index, 1);
    updatedNames.splice(index, 1);

    form.setValue('academyIds', updatedIds);
    form.setValue('academyNames', updatedNames);
  };

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
        onSearch={setSearchTerm}
        isLoading={isLoading}
      />

      {/* Render Selected Academy Tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        {selectedAcademyNames.length > 0 ? (
          selectedAcademyNames.map((academy: string, index: number) => (
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
            No academies added yet.
          </div>
        )}
      </div>
    </div>
  );
};
