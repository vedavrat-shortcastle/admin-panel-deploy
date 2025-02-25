'use client';
import { trpc } from '@/utils/trpc';
import { ContactRole } from '@prisma/client';

// Define the interface for the object that includes the 'Test' property
interface FormData {
  firstName: string;
  lastName: string;
  role: ContactRole;
  email: string;
  phone: string;
}

const defaultFormData: FormData = {
  firstName: 'John',
  lastName: 'Doe',
  role: 'Headcoach' as ContactRole,
  email: 'john.doe@example.com',
  phone: '123-456-7890',
};

const Test = () => {
  const { mutate: updateContact } = trpc.contacts.updateById.useMutation();

  const onClick = async () => {
    await updateContact(
      { id: 89, ...defaultFormData },
      {
        onSuccess: () => {
          console.log('updated');
        },
        onError: () => {
          console.log('failed');
        },
      }
    );
  };

  return (
    <div>
      <button onClick={onClick}>button</button>
    </div>
  );
};

export default Test;
