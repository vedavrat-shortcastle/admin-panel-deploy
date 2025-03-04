import React, { useState, useEffect } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import { X } from 'lucide-react';
import { SearchableSelect } from '@/components/SearchableSelect';

interface GetAcademyNamesRes {
  id: string;
  name: string;
}

interface AcademyNamesProps {
  form: UseFormReturn<any>;
  mode: 'single' | 'multiple';
  initialIds?: string[];
}

export const AcademyNames: React.FC<AcademyNamesProps> = ({
  form,
  mode,
  initialIds,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  const {
    data: academyNamesData,
    error,
    isLoading,
  } = trpc.academy.getAcademyNames.useQuery(searchTerm, {
    enabled: isFocused,
  });

  const { data: initialAcademies } = trpc.academy.getAcademyByIds.useQuery(
    initialIds || [],
    {
      enabled: Array.isArray(initialIds) && initialIds.length > 0,
      onSuccess: (data) => {
        const initialNames = data.map((academy) => academy.name);
        form.setValue('academyNames', initialNames);
      },
    }
  );

  useEffect(() => {
    if (initialAcademies && initialAcademies.length > 0) {
      const validAcademies = initialAcademies.filter(
        (academy): academy is GetAcademyNamesRes => academy !== null
      );
      form.setValue(
        'academyIds',
        validAcademies.map((academy) => academy.id)
      );
      form.setValue(
        'academyNames',
        validAcademies.map((academy) => academy.name)
      );
    }
  }, [initialAcademies, form]);

  if (error) {
    return <div>Error loading academy names: {error.message}</div>;
  }

  const selectedIds = useWatch({
    control: form.control,
    name: mode === 'multiple' ? 'academyIds' : 'academyId',
    defaultValue: mode === 'multiple' ? [] : '',
  });

  const selectedNames = useWatch({
    control: form.control,
    name: mode === 'multiple' ? 'academyNames' : 'academyName',
    defaultValue: mode === 'multiple' ? [] : '',
  });

  useEffect(() => {
    if (academyNamesData && mode === 'multiple' && selectedIds.length > 0) {
      const currentNames = new Set(selectedNames as string[]);
      const newNames = selectedIds
        .map(
          (id: string) =>
            academyNamesData.find((academy) => academy.id === id)?.name || ''
        )
        .filter(Boolean) as string[];

      const filteredNewNames = newNames.filter(
        (name: string): name is string => name !== ''
      );
      form.setValue('academyNames', [
        ...new Set([...filteredNewNames, ...selectedNames]),
      ]);

      if (
        newNames.length !== currentNames.size ||
        !newNames.every((name: string) => currentNames.has(name))
      ) {
        form.setValue(
          'academyNames',
          Array.from(new Set([...currentNames, ...newNames]))
        );
      }
    }
  }, [selectedIds, academyNamesData, form, mode]);

  const handleOnSelect = (selectedAcademy: GetAcademyNamesRes) => {
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
    if (mode === 'multiple') {
      const updatedIds = [...(selectedIds as string[])];
      const updatedNames = [...(selectedNames as string[])];

      updatedIds.splice(index, 1);
      updatedNames.splice(index, 1);

      form.setValue('academyIds', updatedIds);
      form.setValue('academyNames', updatedNames);
    } else {
      form.setValue('academyId', '');
      form.setValue('academyName', '');
      form.setValue('academyNameInput', '');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setSearchTerm('');
  };

  return (
    <div>
      <SearchableSelect<GetAcademyNamesRes>
        form={form}
        fieldName={mode === 'multiple' ? 'academyNames' : 'academyName'}
        label="Academy Names"
        placeholder="Search Academy and Select"
        data={academyNamesData || []}
        displayKey="name"
        selectionMode="multiple"
        onSelectItem={handleOnSelect}
        onSearch={setSearchTerm}
        isLoading={isLoading}
        onFocus={handleFocus} // Add focus handler
        onBlur={handleBlur} // Add blur handler
      />

      {mode === 'multiple' && selectedNames.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedNames.map((academy: string, index: number) => (
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
          ))}
        </div>
      )}

      {mode === 'multiple' && selectedNames.length === 0 && (
        <div className="text-gray-400 text-sm italic mt-2">
          No academies added yet.
        </div>
      )}
    </div>
  );
};
