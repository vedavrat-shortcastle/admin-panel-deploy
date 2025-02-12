import { contactsRouter } from '@/app/server/routers/contacts';
import { usersRouter } from '@/app/server/routers/users';
import { router } from '@/app/server/trpc';

export const appRouter = router({
  users: usersRouter,
  contacts: contactsRouter,
  // Add other routers here
});

export type AppRouter = typeof appRouter;
