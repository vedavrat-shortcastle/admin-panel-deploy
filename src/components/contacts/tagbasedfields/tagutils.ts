import { UseFormReturn } from 'react-hook-form';

export const handleAddItem = (
  { form }: { form: UseFormReturn<any> },
  fieldName: string,
  inputFieldName: string
) => {
  const value = form.watch(inputFieldName)?.trim();
  if (value && !form.watch(fieldName).includes(value)) {
    form.setValue(fieldName, [...form.watch(fieldName), value]);
    form.setValue(inputFieldName, '');
  }
};

// Handle removing a tag or location or language
export const handleRemoveItem = (
  { form }: { form: UseFormReturn<any> },
  fieldName: string,
  item: string
) => {
  const updatedItems = form.watch(fieldName).filter((i: string) => i !== item);
  form.setValue(fieldName, updatedItems);
};
