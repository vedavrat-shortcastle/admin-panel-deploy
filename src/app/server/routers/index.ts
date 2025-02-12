import { academyRouter } from '@/app/server/routers/academies';
import { contactsRouter } from '@/app/server/routers/contacts';
import { locationRouter } from '@/app/server/routers/locations';
import { usersRouter } from '@/app/server/routers/users';
import { router } from '@/app/server/trpc';

export const appRouter = router({
  users: usersRouter,
  contacts: contactsRouter,
  academy: academyRouter,
  location: locationRouter,
  // Add other routers here
});

export type AppRouter = typeof appRouter;
