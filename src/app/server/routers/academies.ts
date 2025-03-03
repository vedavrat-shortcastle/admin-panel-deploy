import { procedure, router } from '@/app/server/trpc';
import { z } from 'zod';

export const academyRouter = router({
  getAcademyNames: procedure.input(z.string()).query(async ({ ctx, input }) => {
    const academies = await ctx.db.academy.findMany({
      take: 20,
      where: {
        name: {
          contains: input,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    return academies;
  }),

  getAcademyByIds: procedure
    .input(z.union([z.string(), z.array(z.string())]))
    .query(async ({ ctx, input }) => {
      const ids = Array.isArray(input) ? input : [input];
      const academies = await ctx.db.academy.findMany({
        where: {
          id: {
            in: ids,
          },
        },
        select: {
          id: true,
          name: true,
        },
      });
      return academies;
    }),
});
