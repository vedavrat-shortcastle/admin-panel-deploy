import { SearchableSelect } from '@/components/SearchableSelect';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';

interface GetContactsRes {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

import { UseFormReturn } from 'react-hook-form';

interface SearchContactProps {
  form: UseFormReturn<any>;
}

const SearchContact = ({ form }: SearchContactProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data, isLoading, error } = trpc.contacts.getAll.useQuery(searchTerm, {
    enabled: searchTerm.length > 0,
  });

  if (error) {
    return <div>Error loading academy names: {error.message}</div>;
  }

  const handleOnSelect = (selectedContact: GetContactsRes) => {
    form.setValue('contactId', selectedContact.id);
    form.setValue(
      'contactInput',
      selectedContact.firstName +
        ' ' +
        selectedContact.lastName +
        ' (' +
        selectedContact.email +
        ')'
    );
    console.log(form.getValues('contactId'));

    setSearchTerm('');
  };

  return (
    <div>
      <SearchableSelect
        fieldName="contact"
        data={data}
        form={form}
        selectionMode="single"
        displayKey={['firstName', 'lastName', 'email']}
        label="Contact"
        placeholder="Search Contact"
        isLoading={isLoading}
        onSelectItem={handleOnSelect}
        onSearch={setSearchTerm}
      />
    </div>
  );
};

export default SearchContact;
