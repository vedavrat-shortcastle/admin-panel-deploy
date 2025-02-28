import { SearchableSelect } from '@/components/SearchableSelect';
import { trpc } from '@/utils/trpc';
import { useState, useEffect } from 'react';

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
  const contactId = form.watch('contactId'); // Get the contactId from the form
  const { data, isLoading, error } = trpc.contacts.getAll.useQuery(searchTerm, {
    enabled: searchTerm.length > 0,
  });

  const {
    data: selectedContact,
    isLoading: isSelectedContactLoading,
    error: selectedContactError,
  } = trpc.contacts.getById.useQuery(String(contactId), {
    enabled: !!contactId, // Only fetch if contactId is set
  });

  useEffect(() => {
    if (selectedContact) {
      form.setValue(
        'contactInput',
        selectedContact.firstName +
          ' ' +
          selectedContact.lastName +
          ' (' +
          selectedContact.email +
          ')'
      );
    }
  }, [selectedContact, form]);

  if (error) {
    return <div>Error loading academy names: {error.message}</div>;
  }

  if (selectedContactError) {
    return (
      <div>Error loading contact details: {selectedContactError.message}</div>
    );
  }

  const handleOnSelect = (selectedContact: GetContactsRes) => {
    form.setValue('contactId', selectedContact.id);
    // form.setValue(
    //   'contactInput',
    //   selectedContact.firstName +
    //     ' ' +
    //     selectedContact.lastName +
    //     ' (' +
    //     selectedContact.email +
    //     ')'
    // );
    // console.log(form.getValues('contactId'));

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
      {isSelectedContactLoading && <div>Loading Contact Details...</div>}
    </div>
  );
};

export default SearchContact;
