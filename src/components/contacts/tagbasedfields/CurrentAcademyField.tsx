import React, { useMemo } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface getAcademyNamesRes {
  id: string;
  name: string;
}

export const CurrentAcademy: React.FC<{ form: UseFormReturn<any> }> = ({
  form,
}) => {
  const academyNames = useWatch({
    control: form.control,
    name: 'academyNames',
    defaultValue: [],
  });
  const academyIds = useWatch({
    control: form.control,
    name: 'academyIds',
    defaultValue: [],
  });
  const currentAcademy = useWatch({
    control: form.control,
    name: 'currentAcademy',
    defaultValue: '',
  });

  const academyData: getAcademyNamesRes[] = useMemo(() => {
    return academyNames
      .map((name: string, index: number) => ({
        id: academyIds[index]?.trim() || `academy-${index}`, // Ensure a non-empty string
        name: name,
      }))
      .filter((academy) => academy.id); // Remove any entry with an empty id
  }, [academyNames, academyIds]);

  const handleOnSelect = (selectedAcademy: getAcademyNamesRes | null) => {
    if (selectedAcademy) {
      form.setValue('currentAcademyInput', selectedAcademy.name);
      form.setValue('currentAcademy', selectedAcademy.id);
    } else {
      form.setValue('currentAcademyInput', '');
      form.setValue('currentAcademy', '');
    }
  };

  return (
    <div>
      <Select
        onValueChange={(value) => {
          if (value === 'clear') {
            handleOnSelect(null);
          } else {
            const selected = academyData.find(
              (academy) => academy.id === value
            );
            if (selected) {
              handleOnSelect(selected);
            }
          }
        }}
        value={currentAcademy}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Current Academy" />
        </SelectTrigger>

        <SelectContent>
          <ScrollArea>
            {academyData.map((academy) => (
              <SelectItem key={academy.id} value={academy.id}>
                {academy.name}
              </SelectItem>
            ))}
            <SelectItem key="clear" className="border-t-2" value="clear">
              Clear Selection
            </SelectItem>
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
};
