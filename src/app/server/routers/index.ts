import { academyRouter } from '@/app/server/routers/academies';
import { contactsRouter } from '@/app/server/routers/contacts';
import { tagsRouter } from '@/app/server/routers/customTags';
import { locationRouter } from '@/app/server/routers/locations';
import { subscriptionRouter } from '@/app/server/routers/subscription';
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
  filter: filterRouter,
  // Add other routers here
});

export type AppRouter = typeof appRouter;
