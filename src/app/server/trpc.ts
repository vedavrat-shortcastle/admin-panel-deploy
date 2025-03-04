import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';

import { initTRPC } from '@trpc/server';
import { getServerSession } from 'next-auth';
import superjson from 'superjson';

export const createContext = async () => {
  const userDetails = await getServerSession(authOptions);
  return {
    db,
    userDetails,
  };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

export const middleware = t.middleware;
export const createCallerFactory = t.createCallerFactory;
export const mergeRouters = t.mergeRouters;

export const router = t.router;
export const procedure = t.procedure;
