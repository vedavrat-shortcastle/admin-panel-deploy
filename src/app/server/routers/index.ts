import { academyRouter } from '@/app/server/routers/academies';
import { authRouter } from '@/app/server/routers/auth';
import { contactsRouter } from '@/app/server/routers/contacts';
import { tagsRouter } from '@/app/server/routers/customTags';
import { locationRouter } from '@/app/server/routers/locations';
import { subscriptionRouter } from '@/app/server/routers/subscription';
import { superUserRouter } from '@/app/server/routers/superUser';
import { usersRouter } from '@/app/server/routers/users';
import { router } from '@/app/server/trpc';
import { filterRouter } from '@/app/server/routers/savedfilters';

export const appRouter = router({
  users: usersRouter,
  contacts: contactsRouter,
  academy: academyRouter,
  location: locationRouter,
  tags: tagsRouter,
  subscription: subscriptionRouter,
  auth: authRouter,
  superUser: superUserRouter,
  filter: filterRouter,
  // Add other routers here
});

export type AppRouter = typeof appRouter;
