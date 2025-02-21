import { UseFormReturn } from 'react-hook-form';

export type CustomerTable = {
  contact: {
    email: string | null;
    firstName: string | null;
    lastName: string | null;
  };
  academy: { name: string };
  salesType: string;
};

export type custumerFormReturn = UseFormReturn<any>;
