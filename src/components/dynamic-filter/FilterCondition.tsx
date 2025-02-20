import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilterField } from '@/types/dynamicFilter';
import { OPERATOR_BY_TYPE } from '@/utils/dynamicFilter';
import { FilterValueInput } from './FilterValueInput';

interface FilterConditionProps {
  fields: FilterField[];
  fieldId: string;
  operator: string;
  value: any;
  onFieldChange: (fieldId: string) => void;
  onOperatorChange: (operator: string) => void;
  onValueChange: (value: any) => void;
  onRemove: () => void;
}

export const FilterConditions: React.FC<FilterConditionProps> = ({
  fields,
  fieldId,
  operator,
  value,
  onFieldChange,
  onOperatorChange,
  onValueChange,
  onRemove,
}) => {
  const selectedField = fields.find((f) => f.id === fieldId);
  const operators = selectedField ? OPERATOR_BY_TYPE[selectedField.type] : [];

  return (
    <div className="flex items-center space-x-2">
      <Select value={fieldId} onValueChange={onFieldChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select field" />
        </SelectTrigger>
        <SelectContent>
          {fields.map((field) => (
            <SelectItem key={field.id} value={field.id}>
              {field.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={operator} onValueChange={onOperatorChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select operator" />
        </SelectTrigger>
        <SelectContent>
          {operators.map((op) => (
            <SelectItem key={op} value={op}>
              {op}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedField && (
        <FilterValueInput
          field={selectedField}
          operator={operator}
          value={value}
          onChange={onValueChange}
        />
      )}

      <Button variant="ghost" size="icon" onClick={onRemove}>
        ✕
      </Button>
    </div>
  );
};
