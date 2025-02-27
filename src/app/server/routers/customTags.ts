import { procedure, router } from '@/app/server/trpc';
import { z } from 'zod';

export const tagsRouter = router({
  getTags: procedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const tags = await ctx.db.tag.findMany({
        take: 20,
        where: {
          name: {
            contains: input,
            mode: 'insensitive',
          },
        },
        select: {
          name: true,
        },
      });
      return tags;
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }),
});
