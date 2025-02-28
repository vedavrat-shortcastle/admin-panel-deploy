import { CustomRequest } from '@/types/apiTypes';
import { AdminRole, Permission } from '@prisma/client';

export type DecodedData = {
  verify: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: AdminRole;
  };
  permissions: Permission[];
  exp: number;
};

export const getDecodedData = async (headers: CustomRequest['headers']) => {
  const tokenData = headers.get('tokenData');
  const decodedData: DecodedData = tokenData ? JSON.parse(tokenData) : null;
  return decodedData;
};
