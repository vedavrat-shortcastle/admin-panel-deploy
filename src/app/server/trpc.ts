import { db } from '@/lib/db';
import { CustomRequest } from '@/types/apiTypes';
import { getDecodedData } from '@/utils/getUser';
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

export const createContext = async ({ req }: { req: CustomRequest }) => {
  const decoded = await getDecodedData(req.headers);

  return {
    db,
    decoded,
    // Add any other context items here
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
