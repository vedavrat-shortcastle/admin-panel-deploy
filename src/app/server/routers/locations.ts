import { procedure, router } from '@/app/server/trpc';
import { z } from 'zod';

export const locationRouter = router({
  getAllLocations: procedure.input(z.string()).query(async ({ ctx, input }) => {
    const locations = await ctx.db.location.findMany({
      take: 20,
      where: {
        city: {
          contains: input,
          mode: 'insensitive',
        },
      },
      select: {
        city: true,
        state: true,
        country: true,
      },
    });
    return locations;
  }),
});
