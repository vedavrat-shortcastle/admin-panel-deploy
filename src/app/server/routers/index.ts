import { contactRouter } from '@/app/server/routers/contact';
import { usersRouter } from '@/app/server/routers/users';
import { router } from '@/app/server/trpc';

export const appRouter = router({
  users: usersRouter,
  contact: contactRouter,
  // Add other routers here
});

export type AppRouter = typeof appRouter;
