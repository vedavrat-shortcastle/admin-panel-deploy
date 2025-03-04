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
import { Label } from '@/components/ui/label';

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
        id: academyIds[index]?.trim() || `academy-${index}`,
        name: name,
      }))
      .filter((academy: getAcademyNamesRes) => academy.id);
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
    <div className="space-y-2">
      <Label htmlFor="current-academy-select">Current Academy</Label>
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
        <SelectTrigger id="current-academy-select">
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
